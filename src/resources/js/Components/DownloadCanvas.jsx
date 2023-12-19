import React, { useState } from 'react';
import SelectablePage from './SelectablePage';

const DownloadCanvas = ({ canvasRef, filename }) => {
    const downloadCanvas = () => {
        if (! canvasRef.current) {
            return;
        }

        const dataURL = canvasRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = filename || 'canvas_image.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={downloadCanvas}>Download</button>
    );
};

export default DownloadCanvas;
