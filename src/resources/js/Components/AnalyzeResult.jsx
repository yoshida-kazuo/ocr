import React, { useEffect } from 'react';
import axios from 'axios';

const INTERVAL = 5000;

const AnalyzeResult = ({
    analyze,
    setAnalyze,
    analyzeResult,
}) => {
    useEffect(() => {
        let intervalId;

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
            setAnalyze(null);
        };

        if (analyze) {
            fetchDataWithInterval();

            setTimeout(stopFetchingData, 180000);
        }

        return () => {
            stopFetchingData();
        };
    }, [clearInterval, setAnalyze, analyzeResult]);

    return null;
};

export default AnalyzeResult;
