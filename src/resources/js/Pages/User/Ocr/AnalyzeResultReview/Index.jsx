import React, { useEffect, useState, useRef } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { pdfjs, Document, Page } from 'react-pdf';
import { Rnd } from 'react-rnd';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

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
const SELECTING_STYLE = {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'dotted 1px red',
    background: 'rgba(255,0,0,.1)',
    boxSizing: 'border-box',
    position: 'absolute',
    userSelect: 'none',
};
const SELECTION_MENU_ID = 'selection-menu';
const DEFAULT_MODAL_DATA = {
    'index': null,
    'content': '',
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

    const canvasRef = useRef();
    const modalWriterRef = useRef();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageOrientations, setPageOrientations] = useState();
    const [selections, setSelections] = useState([]);
    const [modalData, setModalData] = useState(DEFAULT_MODAL_DATA);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selecting, setSelecting] = useState(SELECTING_STYLE);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    const { show } = useContextMenu({});

    const getMousePos = (x, y, elm) => {
        const rect = elm.getBoundingClientRect();

        return {
            x: x - rect.left,
            y: y - rect.top,
            w: rect.width,
            h: rect.height,
        };
    };

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
                    content: word.content,
                    confidence: word.confidence
                },
            ]);
        });
    };
    const handleRenderSuccess = () => {
        // const context = canvasRef.current.getContext('2d');
        // pages.lines?.map((line, index) => {
        //     const minX = Math.min(...line.polygon.filter((_, idx) => idx % 2 === 0));
        //     const minY = Math.min(...line.polygon.filter((_, idx) => idx % 2 === 1));
        //     const maxX = Math.max(...line.polygon.filter((_, idx) => idx % 2 === 0));
        //     const maxY = Math.max(...line.polygon.filter((_, idx) => idx % 2 === 1));

        //     const x = minX * SCALE - 1;
        //     const y = minY * SCALE - 1;
        //     const width = (maxX - minX) * SCALE + 2;
        //     const height = (maxY - minY) * SCALE + 2;

        //     context.setLineDash([3, 3]);
        //     context.lineWidth = 1;
        //     context.strokeStyle = 'green';
        //     context.rect(x, y, width, height);
        //     context.stroke();
        // });
    };
    const handleMouseDown = (event) => {
        event.preventDefault();
        if (event.button !== 0) {
            return;
        }
        setIsSelecting(true);

        const { x, y } = getMousePos(event.clientX, event.clientY, canvasRef.current);
        setStartX(x);
        setStartY(y);
    };
    const handleMouseMove = (event) => {
        event.preventDefault();
        if (! isSelecting) {
            return;
        }
        const { x, y } = getMousePos(event.clientX, event.clientY, canvasRef.current);

        setSelecting({
            ...selecting,
            display: 'flex',
            left: startX,
            top: startY,
            width: x - startX,
            height: y - startY,
        });
    };
    const handleMouseUp = (event) => {
        event.preventDefault();
        if (! isSelecting) {
            return;
        }

        const { x, y } = getMousePos(event.clientX, event.clientY, canvasRef.current);
        const width = x - startX;
        const height = y - startY;
        if (width > 12
            && height > 12
        ) {
            const index = selections.length;
            setSelections(prevSelections => {
                const newSelections = [...prevSelections];
                newSelections[index] = {
                    x: startX,
                    y: startY,
                    width: width,
                    height: height,
                    content: '',
                    confidence: 0,
                };

                return newSelections;
            });

            modalWriterRef.current.showModal();
            setModalData({
                'index': index,
                'content': '',
            });
        }

        setSelecting(SELECTING_STYLE);
        setIsSelecting(false);
    };

    const selectionMenu = (index, event) => {
        event.preventDefault();
        event.stopPropagation();

        show({
            id: SELECTION_MENU_ID,
            event: event,
            props: {
                index: index
            }
        });
    };

    const handleItemClick = ({ id, props, data, triggerEvent }) => {
        switch(id) {
            case 'remove':
                handleDeleteSelection(props.index);
                break;
            case 'edit':
                modalWriterRef.current.showModal();
                setModalData({
                    'index': props.index,
                    'content': selections[props.index].content
                });
                break;
        };
    };
    const handleDeleteSelection = (index) => {
        setSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections.splice(index, 1);

            return newSelections;
        });
    };
    const updateModalData = (key, value) => {
        setModalData(prevModalData => ({
            ...prevModalData,
            [key]: value
        }));
    };
    const modalUpdate = () => {
        setSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections[modalData.index].content = modalData.content;

            return newSelections;
        });

        modalWriterRef.current.close();
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
                            canvasRef={canvasRef}
                            pageNumber={pageNumber}
                            scale={SCALE}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            onLoadSuccess={handlePageOnLoadSuccess}
                            onRenderSuccess={handleRenderSuccess}
                            width={ORIENTATIONS[pageOrientations].width}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            {selections?.map((selection, index) => (
                                <Rnd
                                    key={index}
                                    bounds={canvasRef.current}
                                    style={SELECTION_STYLE}
                                    size={{ width: selection.width, height: selection.height }}
                                    position={{ x: selection.x, y: selection.y }}
                                    onDragStart={ev => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                    }}
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
                                                content: newSelections[index].content,
                                                confidence: newSelections[index].confidence,
                                                ...position,
                                            };

                                            return newSelections;
                                        });
                                    }}
                                    onContextMenu={event => selectionMenu(index, event)}
                                    onClick={ev => {
                                        //
                                    }}
                                    className="whitespace-nowrap"
                                >{selection.content}</Rnd>
                            ))}

                            <div style={selecting} />
                            <Menu id={SELECTION_MENU_ID}>
                                <Item id="remove" onClick={handleItemClick}>
                                    {t('Remove')}
                                </Item>
                                <Item id="edit" onClick={handleItemClick}>
                                    {t('Edit')}
                                </Item>
                            </Menu>
                        </Page>
                    )}
                </div>
            </Document>

            <dialog
                ref={modalWriterRef}
                className="modal modal-bottom w-full sm:max-w-[calc(100%-16em)] sm:left-64 transition-transform"
                onClose={ev => setModalData(DEFAULT_MODAL_DATA)}
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t('Edit')}</h3>
                    <div>
                        <InputLabel htmlFor="content" value={t('Content')} />
                        <TextInput
                            id="content"
                            className="w-auto"
                            value={modalData.content}
                            onChange={(e) => updateModalData('content', e.target.value)}
                        />
                        <InputError className="" message="" />
                    </div>

                    <div className="modal-action">
                        <div className="join">
                            <button
                                className="btn btn-primary join-item"
                                onClick={modalUpdate}
                            >{t('Register')}</button>
                            <form method="dialog">
                                <button className="btn join-item">{t('Close')}</button>
                            </form>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>{t('Close')}</button>
                </form>
            </dialog>
        </UserLayout>
    );
};

export default Index;
