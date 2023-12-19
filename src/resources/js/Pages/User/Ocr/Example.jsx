import React, { useEffect, useState, useRef, useCallback } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { pdfjs, Document, Page } from 'react-pdf';
import SelectablePage from '@/Components/SelectablePage';
import AnalyzeResult from '@/Components/AnalyzeResult';
import axios from 'axios';
import Select from '@/Components/Select';

const options = {
    cMapUrl: `/static/vendor/pdfjs/cmaps/`,
};
const ORIENTATIONS = {
    portrait: {
        width: 2480,
        height: 3508,
    },
    landscape: {
        width: 3508,
        height: 2480,
    },
};
const SERVICES = [
    { value: 'tesseract-v1', label: 'tesseract-v1' },
    { value: 'tesseract-v2', label: 'tesseract-v2' },
    { value: 'easyocr-v1', label: 'easyocr-v1' },
    { value: 'paddleocr-v1', label: 'paddleocr-v1' },
    { value: 'azure-v1', label: 'azure-v1' },
];

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export default function Example({
    auth,
    lang,
    timezone,
    ocrconfig,
}) {
    const { t } = useTranslation();

    const [fileUrl, setFileUrl] = useState();
    const [numPages, setNumPages] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [cv, setCv] = useState({});
    const [selectionsData, setSelectionsData] = useState();
    const [canvasData, setCavasData] = useState();
    const [pdfData, setPdfData] = useState();
    const [analyze, setAnalyze] = useState();
    const [pdfDocument, setPdfDocument] = useState();
    const [pageOrientations, setPageOrientations] = useState();
    const [engine, setEngine] = useState(ocrconfig.service);
    const [type, setType] = useState();

    const inputRef = useRef();
    const canvasRef = useRef();
    const analyzeResultRef = useRef();
    const analyzeBtnRef = useRef();

    const downloadConvertfile = useCallback((responseData) => {
        const url = responseData.url;
        setFileUrl(url);
    }, []);

    const handleFileChange = useCallback((event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile.type === 'application/pdf') {
            setType('pdf');
            setFileUrl(selectedFile);
            convertFileToBase64(selectedFile);
        } else {
            setType('image');
            const formData = new FormData();
            formData.append('file', selectedFile);

            axios.post(route('user.ocr.pdf-convert'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                .then(response => downloadConvertfile(response.data))
                .catch(error => console.error(t('Error converting image to PDF:'), error));
        }
    }, [setType]);

    const handleClickPage = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

    const onLoadSuccess = useCallback((pdf) => {
        if (type === 'image') {
            pdf.getData()
                .then(arrayBuffer => {
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const binaryString = uint8Array.reduce((str, byte) => str + String.fromCharCode(byte), '');
                    setPdfData(`data:application/pdf;base64,${btoa(binaryString)}`);
                });
        }
        setPdfDocument(pdf);
        setCurrentPage(1);
        setNumPages(pdf.numPages);
    }, [type]);

    const handleUpload = useCallback(async () => {
        if (selectionsData && canvasData) {
            try {
                axios.post(route('api.user.ocr.analyze.store'), {
                        selections: selectionsData,
                        pdf: pdfData,
                        pageNumber: currentPage,
                        engine: engine,
                    })
                    .then(response => {
                        if (response.data.content) {
                            setAnalyze(response.data);
                        }
                    })
                    .catch(error => {
                        throw new Error(error);
                    });
            } catch (error) {
                console.error(t('Error uploading selections data : ', error));
            }
        }
    }, [selectionsData, canvasData, pdfData, currentPage, engine]);

    const convertFileToBase64 = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPdfData(reader.result);
        };

        reader.readAsDataURL(file);
    }, []);

    const analyzeResult = useCallback((data) => {
        const extracted_text = JSON.parse(data.content.extracted_text);
        const pages = extracted_text.analyzeResult.pages[0];

        let unit = 1;
        if (pages.unit === 'inch') {
            unit = 72;
        }

        const canvas = analyzeResultRef.current;
        const context = canvas.getContext('2d');

        canvas.width = ORIENTATIONS[pageOrientations].width * 0.5;
        canvas.height = ORIENTATIONS[pageOrientations].height * 0.5;
        canvas.style.position = 'absolute';
        canvas.style.opacity = "0.9";
        canvas.style.top = 0;
        canvas.style.left = 0;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.clearRect(0, 0, canvas.width, canvas.height);

        pages.words.forEach(page => {
            const content = page.content;
            const polygon = page.polygon;

            context.fillStyle = 'rgb(255,0,0)';
            context.font = '18px Arial';

            context.fillText(content, polygon[0] * unit * 0.5, polygon[1] * unit * 0.5);

            context.strokeStyle = 'rgba(255,0,0,0.7)';
            context.beginPath();
            context.moveTo(polygon[0] * unit * 0.5, polygon[1] * unit * 0.5);
            for (let i = 2; i < polygon.length; i += 2) {
                context.lineTo(polygon[i] * unit * 0.5, polygon[i + 1] * unit * 0.5);
            }
            context.closePath();
            context.stroke();
        });
    }, [pageOrientations]);

    useEffect(() => {
        if (currentPage && pdfDocument) {
            pdfDocument.getPage(currentPage)
                .then(page => {
                    let [, , w, h] = page.view;
                    if (page.rotaet === 90
                        || page.rotate === 270
                    ) {
                        const temp = w;
                        w = h;
                        h = w;
                    }

                    if (w > h) {
                        setPageOrientations('landscape');
                    } else {
                        setPageOrientations('portrait');
                    }
                });
        }
    }, [currentPage, pdfDocument, setPageOrientations]);

    useEffect(() => {
        if (window.cv && typeof window.cv === 'object') {
            setCv(window.cv);
            return;
        }

        const script = document.createElement('script');
        script.src = '/static/vendor/opencv/opencv.js';
        script.async = true;
        script.onload = () => {
            setCv(window.cv);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <UserLayout
            user={auth.user}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('OCR Analyze Check')} />

            <div className="relative">
                <div className="border flex">
                    <Select
                        id="service"
                        options={SERVICES}
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        className="select select-bordered"
                    />
                    <input
                        type="file"
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="file-input max-w-xs"
                    />
                </div>

                <Document
                    onLoadSuccess={onLoadSuccess}
                    file={fileUrl}
                    options={options}
                >
                    {numPages && (
                        <div className="flex flex-wrap overflow-y-auto max-h-56 border-l border-r">
                            {[...Array(numPages)].map((_, i) => i+1).map(pageNumber =>
                                <Page
                                    key={`page_${pageNumber}`}
                                    pageNumber={pageNumber}
                                    scale={0.2}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                    onClick={() => handleClickPage(pageNumber)}
                                    className="cursor-pointer"
                                />
                            )}
                        </div>
                    )}

                    {cv && currentPage && pageOrientations && (
                        <div className="flex overflow-x-scroll border">
                            <SelectablePage
                                canvasRef={canvasRef}
                                analyzeResultRef={analyzeResultRef}
                                setCurrentPage={setCurrentPage}
                                pageNumber={currentPage}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                width={ORIENTATIONS[pageOrientations].width}
                                scale={0.5}
                                className="overflow-hidden"
                                cv={cv}
                                setSelectionsData={setSelectionsData}
                                setCanvasData={setCavasData}
                                analyzeBtnRef={analyzeBtnRef}
                                analyze={analyze}
                            />
                        </div>
                    )}
                </Document>

                <button
                    className="btn btn-primary hidden"
                    onClick={handleUpload}
                    disabled={analyze}
                    ref={analyzeBtnRef}
                >{t('Upload Selections Data')}</button>

                {analyze && (
                    <AnalyzeResult
                        analyze={analyze}
                        setAnalyze={setAnalyze}
                        analyzeResult={analyzeResult}
                    />
                )}

                {analyze && (
                    <div
                        onContextMenu={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        className="flex justify-center items-center w-full h-full left-0 top-0 absolute bg-white opacity-70 z-[100]"
                    >
                        <span
                            className="loading loading-ring loading-lg z-[100] scale-[15]"
                        />
                    </div>
                )}
            </div>
        </UserLayout>
    )
}
