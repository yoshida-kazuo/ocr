import React, { useEffect, useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { pdfjs, Document, Page } from 'react-pdf';
import { Rnd } from 'react-rnd';

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
    { value: 'tesseract-v1', label: 'OCR Engine V1' },
    { value: 'tesseract-v2', label: 'OCR Engine V1.1' },
    { value: 'easyocr-v1', label: 'OCR Engine V2' },
    { value: 'paddleocr-v1', label: 'OCR Engine V3' },
    { value: 'azure-v1', label: 'OCR Engine V4' },
];
const SCALE = 0.5;
const SELECTION_STYLE = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,0,0,.1)',
    boxSizing: 'border-box',
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const Index = ({
    auth,
    lang,
    timezone,
    ocrconfig,
    ocrResult,
}) => {
    const { t } = useTranslation();
    const ocrPagesResult = ocrResult.ocr_pages_results.at();
    const pages = JSON.parse(ocrPagesResult.extracted_text).analyzeResult.pages.at();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageOrientations, setPageOrientations] = useState();
    const [selections, setSelections] = useState([]);

    const handleDocumentOnLoadSuccess = (pdf) => {
        setSelections([]);

        pdf.getPage(pageNumber)
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
    };
    const handlePageOnLoadSuccess = (page) => {
        pages.words?.map((word, index) => {
            const minX = Math.min(...word.polygon.filter((_, idx) => idx % 2 === 0));
            const minY = Math.min(...word.polygon.filter((_, idx) => idx % 2 === 1));
            const maxX = Math.max(...word.polygon.filter((_, idx) => idx % 2 === 0));
            const maxY = Math.max(...word.polygon.filter((_, idx) => idx % 2 === 1));

            const x = minX * SCALE;
            const y = minY * SCALE;
            const width = (maxX - minX) * SCALE;
            const height = (maxY - minY) * SCALE;

            setSelections(prevSelections => [
                ...prevSelections, {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    text: word.content,
                },
            ]);
        });
    };

    return(
        <UserLayout
            user={auth.user}
            lang={lang}
        >
            <Head title={ocrResult.document_id} />

            <Document
                file={route('user.ocr.analyze-page-pdf', [ocrResult.document_id, ocrPagesResult.page_number])}
                options={options}
                onLoadSuccess={handleDocumentOnLoadSuccess}
            >
                <div className="overflow-x-auto">
                    {pageOrientations && (
                        <Page
                            pageNumber={pageNumber}
                            scale={SCALE}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            onLoadSuccess={handlePageOnLoadSuccess}
                            width={ORIENTATIONS[pageOrientations].width}
                        >
                            {selections?.map((selection, index) => (
                                <Rnd
                                    key={index}
                                    style={SELECTION_STYLE}
                                    size={{ width: selection.width, height: selection.height }}
                                    position={{ x: selection.x, y: selection.y }}
                                    onDragStop={(e, d) => {
                                        setSelections(prevSelections => {
                                            const newSelections = [...prevSelections];

                                            newSelections[index] = {
                                                ...newSelections[index],
                                                x: d.x,
                                                y: d.y
                                            };

                                            return newSelections;
                                        });
                                    }}
                                    onResize={(e, direction, ref, delta, position) => {
                                        setSelections(prevSelections => {
                                            const newSelections = [...prevSelections];

                                            newSelections[index] = {
                                                width: ref.style.width,
                                                height: ref.style.height,
                                                text: newSelections[index].text,
                                                ...position,
                                            };

                                            return newSelections;
                                        });
                                    }}
                                >{selection.text}</Rnd>
                            ))}
                        </Page>
                    )};
                </div>
            </Document>

        </UserLayout>
    )
};

export default Index;
