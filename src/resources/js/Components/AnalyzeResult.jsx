import React, { useEffect } from 'react';
import axios from 'axios';

const INTERVAL = 5000;
const TIMEOUT_DURATION = 10 * 60 * 1000;

const AnalyzeResult = ({
    analyze,
    setAnalyze,
    analyzeResult,
}) => {
    useEffect(() => {
        let intervalId,
            timeoutId;

        const fetchData = () => {
            axios.get(route('api.user.ocr.analyze', {
                    documentId: analyze.content.document_id,
                }))
                .then(response => {
                    if (response.data.status === 'ok') {
                        setAnalyze(null);
                        analyzeResult(response.data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        const fetchDataWithInterval = () => {
            intervalId = setInterval(fetchData, INTERVAL);
        };

        const stopFetchingData = () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            setAnalyze(null);
        };

        if (analyze) {
            fetchDataWithInterval();

            timeoutId = setTimeout(stopFetchingData, TIMEOUT_DURATION);
        }

        return () => {
            stopFetchingData();
        };
    }, [clearInterval, setAnalyze, analyzeResult]);

    return null;
};

export default AnalyzeResult;
