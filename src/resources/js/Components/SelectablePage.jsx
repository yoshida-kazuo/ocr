import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Page } from 'react-pdf';
import { Rnd } from 'react-rnd';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { useTranslation } from 'react-i18next';
import Bee from '@/Lib/Bee.mjs';

const SELECTION_STYLE = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px red',
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

const SelectablePage = React.memo(({
    canvasRef,
    analyzeResultRef,
    pageNumber,
    setCurrentPage,
    cv,
    setSelectionsData,
    setCanvasData,
    analyzeBtnRef,
    analyze,
    ...props
}) => {
    const { t } = useTranslation();

    const inputRef = useRef();

    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [selections, setSelections] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selecting, setSelecting] = useState(SELECTING_STYLE);
    const [rects, setRects] = useState();

    const { show } = useContextMenu({});

    const getMousePos = useCallback((left, top, element) => {
        const rect = element.getBoundingClientRect();

        return {
            x: left - rect.left,
            y: top - rect.top,
            w: rect.width,
            h: rect.height,
        };
    }, []);

    const handleMouseDown = useCallback((event) => {
        if (event.button !== 0) {
            return;
        }
        setIsSelecting(true);

        const { x, y } = getMousePos(event.clientX, event.clientY, canvasRef.current);
        setStartX(x);
        setStartY(y);
    }, [setIsSelecting, getMousePos, setStartX, setStartY]);

    const handleMouseMove = useCallback((event) => {
        if (! isSelecting) {
            return;
        }
        const { x, y } = getMousePos(event.clientX, event.clientY, canvasRef.current);

        if (canvasRef.current === event.target) {
            setSelecting({
                ...selecting,
                display: 'flex',
                left: startX,
                top: startY,
                width: x - startX,
                height: y - startY,
            });
        }
    }, [startX, startY, isSelecting, selecting, getMousePos, setSelecting]);

    const handleMouseUp = useCallback((event) => {
        if (! isSelecting || event.button !== 0) {
            return;
        }

        if (canvasRef.current === event.target) {
            const { x, y } = getMousePos(event.clientX, event.clientY, canvasRef.current);
            const width = x - startX;
            const height = y - startY;

            setSelections([{
                    width: width,
                    height: height,
                    x: startX,
                    y: startY,
                },
                ...selections
            ]);
        }

        setSelecting(SELECTING_STYLE);
        setIsSelecting(false);
    }, [isSelecting, selections, startX, startY, getMousePos, setIsSelecting, setSelecting]);

    const handleDragStop = useCallback((index, event, direction) => {
        setSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections[index] = {
                ...newSelections[index],
                x: direction.x,
                y: direction.y,
            };

            return newSelections;
        });
    }, [setSelections]);

    const handleResizeStop = useCallback((index, event, direction, ref, delta, position) => {
        setSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections[index] = {
                width: ref.style.width,
                height: ref.style.height,
                ...position,
            };

            return newSelections;
        });
    }, [setSelections]);

    const handleDeleteSelection = useCallback((index) => {
        setSelections(prevSelections => {
            const newSelections = [...prevSelections];
            newSelections.splice(index, 1);

            return newSelections;
        });
    }, [setSelections]);

    const pageMenu = useCallback((event, page) => {
        event.preventDefault();

        show({
            id: PAGE_MENU_ID,
            event: event,
            props: {
                page: page
            }
        });
    }, [show]);

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
    }, [show]);

    useEffect(() => {
        if (rects) {
            setSelections(prevSelections => [
                ...prevSelections,
                ...rects.map(rect => ({
                    x: rect[0],
                    y: rect[1],
                    width: rect[2],
                    height: rect[3],
                }))
            ]);
        }
    }, [rects]);

    useEffect(() => {
        setSelectionsData(selections);
    }, [selections, setSelectionsData]);

    useEffect(() => {
        setCanvasData(canvasRef);
    }, [canvasRef, setCanvasData]);

    const handleItemClick = useCallback(({ id, props, data, triggerEvent }) => {
        switch (id) {
            case 'remove':
                handleDeleteSelection(props.index);
                break;
            case 'setting':
                break;
            case 'trapezoid-correction':
                setSelections([]);
                (new Bee({
                    end: (rectangles) => {
                        setRects(rectangles);
                    }
                })).cells(canvasRef.current, canvasRef.current, 150);
                break;
            case 'clear-selections':
                setSelections([]);
                const canvas = analyzeResultRef.current;
                canvas.width = null;
                canvas.height = null;
                break;
            case 'run-ocr':
                analyzeBtnRef.current.click();
                break;
        }
    }, [analyzeResultRef, handleDeleteSelection, setSelections]);

    return (
        <Page
            canvasRef={canvasRef}
            inputRef={inputRef}
            pageNumber={pageNumber}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={pageMenu}
            {...props}
        >
            <div style={selecting} />
            {selections.map((selection, index) => (
                <Rnd
                    key={index}
                    style={SELECTION_STYLE}
                    size={{ width: selection.width, height: selection.height }}
                    position={{ x: selection.x, y: selection.y }}
                    onDragStop={(event, direction) => handleDragStop(index, event, direction)}
                    onResizeStop={(event, direction, ref, delta, position) => handleResizeStop(index, event, direction, ref, delta, position)}
                    onContextMenu={event => selectionMenu(index, event)}
                    bounds={canvasRef.current}
                />
            ))}
            <Menu id={SELECTION_MENU_ID}>
                <Item id="remove" onClick={handleItemClick}>
                    {t('Remove')}
                </Item>
                <Item id="setup" onClick={handleItemClick}>
                    {t('Setup')}
                </Item>
            </Menu>
            <Menu id={PAGE_MENU_ID}>
                <Item id="trapezoid-correction" onClick={handleItemClick}>
                    {t('Trapezoid Correction')}
                </Item>
                <Item id="clear-selections" onClick={handleItemClick}>
                    {t('Clear selections')}
                </Item>
                <Separator />
                <Item id="run-ocr" onClick={handleItemClick}>
                    {t('Run OCR')}
                </Item>
            </Menu>

            <canvas ref={analyzeResultRef} width={0} height={0} />
        </Page>
    );
});

export default SelectablePage;
