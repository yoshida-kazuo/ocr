import React, { useEffect, useState, useRef, useCallback } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { pdfjs, Document, Page } from 'react-pdf';
import SelectablePage from '@/Components/SelectablePage';
import AnalyzeResult from '@/Components/AnalyzeResult';
import axios from 'axios';

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

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export default function Example({
    auth,
    lang,
    timezone
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

    const inputRef = useRef();
    const canvasRef = useRef();
    const analyzeResultRef = useRef();
    const analyzeBtnRef = useRef();

    const handleFileChange = useCallback((event) => {
        const selectedFile = event.target.files[0];

        setFileUrl(selectedFile);
        convertFileToBase64(selectedFile);
    }, []);

    const handleClickPage = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

    const onLoadSuccess = useCallback((pdf) => {
        setPdfDocument(pdf);
        setCurrentPage(1);
        setNumPages(pdf.numPages);
    }, []);

    const handleUpload = useCallback(async () => {
        if (selectionsData && canvasData) {
            try {
                axios.post(route('api.user.ocr.analyze.store'), {
                        selections: selectionsData,
                        pdf: pdfData,
                        pageNumber: currentPage,
                        canvas: canvasData.current.toDataURL(),
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
    }, [selectionsData, canvasData, pdfData, currentPage]);

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
        console.log(pages);
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

            context.fillStyle = '#000000';
            context.font = '18px Arial';

            context.fillText(content, polygon[0] * unit * 0.5, polygon[1] * unit * 0.5 + 18);

            context.fillStyle = 'rgba(255,0,0,0.5)';
            context.beginPath();
            context.moveTo(polygon[0] * unit * 0.5, polygon[1] * unit * 0.5);
            for (let i = 2; i < polygon.length; i += 2) {
                context.lineTo(polygon[i] * unit * 0.5, polygon[i + 1] * unit * 0.5);
            }
            context.closePath();
            context.fill();
        });
    }, [pageOrientations]);

    useEffect(() => {
        if (currentPage && pdfDocument) {
            pdfDocument.getPage(currentPage)
                .then(page => {
                    let [, , w, h] = page.view;
                    if (page.rotaet === 90 || page.rotate === 270) {
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
                <div className="border">
                    <input
                        type="file"
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="file-input w-full max-w-xs"
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
                        <span className="loading loading-infinity loading-lg z-[100] scale-[15]"></span>
                    </div>
                )}
            </div>
        </UserLayout>
    )
}
