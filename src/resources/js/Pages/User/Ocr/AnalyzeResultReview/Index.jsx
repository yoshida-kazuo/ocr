import React, { useState, useRef, useCallback, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { pdfjs, Document, Page } from 'react-pdf';
import { Rnd } from 'react-rnd';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import Toast from '@/Components/Toast';

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
const PAGE_MENU_ID = 'page-menu';
const SELECTION_MENU_ID = 'selection-menu';
const DEFAULT_MODAL_DATA = {
    'index': null,
    'content': '',
    'confidence': null,
};
const VISIBILITY_VISIBLE = 'canvas-visible';
const VISIBILITY_HIDDEN = 'canvas-invisible';

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
    const [canvasVisibility, setCanvasVisibility] = useState(VISIBILITY_VISIBLE);
    const [rndVisibility, setRndVisibility] = useState(VISIBILITY_VISIBLE);
    const [postSuccess, setPostSuccess] = useState(false);

    const { show } = useContextMenu({});

    const getMousePos = useCallback((x, y, elm) => {
        const rect = elm.getBoundingClientRect();

        return {
            x: x - rect.left,
            y: y - rect.top,
            w: rect.width,
            h: rect.height,
        };
    }, []);

    const handleDocumentOnLoadSuccess = useCallback((pdf) => {
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
    }, []);
    const handlePageOnLoadSuccess = useCallback((page) => {
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
    }, [pages]);
    const handleMouseDown = useCallback((event) => {
        event.preventDefault();
        if (event.button !== 0) {
            return;
        }
        setIsSelecting(true);

        const { x, y } = getMousePos(event.clientX, event.clientY, canvasRef.current);
        setStartX(x);
        setStartY(y);
    }, [canvasRef]);
    const handleMouseMove = useCallback((event) => {
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
    }, [isSelecting, selecting, canvasRef]);
    const handleMouseUp = useCallback((event) => {
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
                'confidence': 0.999999
            });
        }

        setSelecting(SELECTING_STYLE);
        setIsSelecting(false);
    }, [isSelecting, selections, modalWriterRef, canvasRef]);

    const pageMenu = useCallback((event, page) => {
        event.preventDefault();
        event.stopPropagation();

        show({
            id: PAGE_MENU_ID,
            event: event,
            props: {
                //
            },
        })
    }, []);

    const selectionMenu = useCallback((index, event) => {
        event.preventDefault();
        event.stopPropagation();

        show({
            id: SELECTION_MENU_ID,
            event: event,
            props: {
                index: index
            }
        });
    }, []);

    const handlePagecClick = useCallback(({ id, props, data, triggerEvent }) => {
        switch(id) {
            case 'toggle-pdf':
                if (canvasVisibility === VISIBILITY_VISIBLE) {
                    setCanvasVisibility(VISIBILITY_HIDDEN);
                } else {
                    setCanvasVisibility(VISIBILITY_VISIBLE);
                }
                break;
            case 'toggle-rnd':
                if (rndVisibility === VISIBILITY_VISIBLE) {
                    setRndVisibility(VISIBILITY_HIDDEN);
                } else {
                    setRndVisibility(VISIBILITY_VISIBLE);
                }
                break;
            case 'page-save':
                handlPageSave();
                break;
        }
    }, [selections, canvasVisibility, rndVisibility]);
    const handlPageSave = useCallback(() => {
        const putData = [];
        selections.map((selection, index) => {
            const x = Math.round(selection.x * (1 / SCALE));
            const y = Math.round(selection.y * (1 / SCALE));
            const w = Math.round(selection.width * (1 / SCALE));
            const h = Math.round(selection.height * (1 / SCALE));

            putData.push({
                content: selection.content,
                confidence: selection.confidence,
                polygon: [
                    x, y,
                    x+w, y,
                    x+w, y+h,
                    x, y+h
                ]
            });
        });

        axios.put(route('user.ocr.analyze-result-review.update', [
                ocrResult.document_id,
                ocrPagesResult.page_number
            ]), {
                extractedText: putData,
            })
            .then(response => setPostSuccess(true))
            .catch(error => {
                console.log(error);
            });
    }, [ocrResult, ocrPagesResult, selections]);

    const handleItemClick = useCallback(({ id, props, data, triggerEvent }) => {
        switch(id) {
            case 'remove':
                handleDeleteSelection(props.index);
                break;
            case 'edit':
                modalWriterRef.current.showModal();
                setModalData({
                    'index': props.index,
                    'content': selections[props.index].content,
                    'confidence': selections[props.index].confidence,
                });
                break;
        };
    }, [selections, modalWriterRef]);
    const handleDeleteSelection = useCallback((index) => {
        setSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections.splice(index, 1);

            return newSelections;
        });
    }, [selections]);
    const updateModalData = useCallback((key, value) => {
        setModalData(prevModalData => ({
            ...prevModalData,
            [key]: value
        }));
    }, [modalData]);
    const modalUpdate = useCallback(() => {
        setSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections[modalData.index].content = modalData.content;
            newSelections[modalData.index].confidence = modalData.confidence;

            return newSelections;
        });

        modalWriterRef.current.close();
    }, [selections, modalData, modalWriterRef]);

    useEffect(() => {
        if (postSuccess === true) {
            setTimeout(() => {
                setPostSuccess(false);
            }, 3000);
        }
    }, [postSuccess]);

    return(
        <UserLayout
            user={auth.user}
            lang={lang}
        >
            <Head title={ocrResult.document_id} />
            <div className="text-sm breadcrumbs pt-0">
                <ul>
                    <li><a href={route('user.dashboard')}>{t('Dashboard')}</a></li>
                    <li><a href={route('user.ocr.analyze')}>{t('OCR analyses list')}</a></li>
                    <li><a href={route('user.ocr.analyze-result', [ocrResult.document_id])}>{t('List of Analyzed Data')}</a></li>
                    <li>{ocrResult.document_id}</li>
                </ul>
            </div>

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
                            width={ORIENTATIONS[pageOrientations].width}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onContextMenu={pageMenu}
                            className={canvasVisibility}
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
                                                width: parseFloat(ref.style.width.replace('px', '')),
                                                height: parseFloat(ref.style.height.replace('px', '')),
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
                                    className={`whitespace-nowrap ${rndVisibility}`}
                                >{selection.content}</Rnd>
                            ))}

                            <div style={selecting} />
                            <Menu id={PAGE_MENU_ID}>
                                <Item id="toggle-pdf" onClick={handlePagecClick}>
                                    {t('Toggle PDF')}
                                </Item>
                                <Item id="toggle-rnd" onClick={handlePagecClick}>
                                    {t('Toggle Selection')}
                                </Item>
                                <Separator />
                                <Item id="page-save" onClick={handlePagecClick}>
                                    {t('Save')}
                                </Item>
                            </Menu>
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
                            className="input-bordered w-full"
                            value={modalData.content}
                            onChange={(e) => updateModalData('content', e.target.value)}
                        />
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

            <Toast
                show={postSuccess}
                className="toast-center toast-middle"
                alertType="success"
                message={t('You have been registered.')}
            />
        </UserLayout>
    );
};

export default Index;
