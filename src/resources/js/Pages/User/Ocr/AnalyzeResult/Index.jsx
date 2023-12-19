import React, { useState, useCallback } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import TextInput from '@/Components/TextInput';
import axios from 'axios';

const SERVICES = [
    { value: 'tesseract-v1', label: 'tesseract-v1' },
    { value: 'tesseract-v2', label: 'tesseract-v2' },
    { value: 'easyocr-v1', label: 'easyocr-v1' },
    { value: 'paddleocr-v1', label: 'paddleocr-v1' },
    { value: 'azure-v1', label: 'azure-v1' },
];

const Index = ({
    auth,
    lang,
    timezone,
    ocrconfig,
    ocrResult,
    ocrPagesResults,
}) => {
    const { t } = useTranslation();

    const [documentName, setDocumentName] = useState(ocrResult.document_name);

    const handleDocumentNameUpdate = useCallback((ev) => {
        axios.put(route('user.ocr.analyze-result.update', [ocrResult.document_id]), {
                document_name: ev.target.value
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <UserLayout
            user={auth.user}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('List of Analyzed Data')} />
            <div className="text-sm breadcrumbs pt-0">
                <ul>
                    <li><a href={route('user.dashboard')}>{t('Dashboard')}</a></li>
                    <li><a href={route('user.ocr.analyze')}>{t('OCR analyses list')}</a></li>
                    <li>{t('List of Analyzed Data')}</li>
                </ul>
            </div>

            <h3 className="mb-3">
                <TextInput
                    id="document_name"
                    className="*:input-ghost w-full max-w-xs mb-1"
                    placeholder={t('Click to Change Document Name')}
                    onBlur={handleDocumentNameUpdate}
                    onChange={ev => setDocumentName(ev.target.value)}
                    value={documentName}
                /><br />
                {`${t('Document ID')}: ${ocrResult.document_id}`}<br />
                <div className="badge badge-ghost badge-sm">
                    {SERVICES.filter(service => service.value === ocrResult.service)[0]?.label || ocrResult.service}
                </div>
                <span className="text-sm opacity-50 ml-3">{ocrResult.updated_at}</span>
            </h3>

            {ocrPagesResults.total > 0 ? (
                <div className="flex flex-wrap overflow-x-auto">
                    {ocrPagesResults.data.map(ocrPagesResult => (
                        <div
                            key={ocrPagesResult.id}
                            className="flex m-1"
                        >
                            <div className="card w-96 bg-base-100 shadow-xl">
                                <figure>
                                    <img src={route('user.ocr.analyze-page-image', [ocrPagesResult.ocr_result.document_id, ocrPagesResult.page_number])} alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{t('Page number')} {ocrPagesResult.page_number}</h2>
                                    <p className="overflow-hidden truncate">{ocrPagesResult.full_text}</p>
                                    <div className="card-actions justify-end join gap-0">
                                        <a
                                            className="btn btn-secondary join-item"
                                            href={route('user.ocr.analyze-page-pdf', [ocrPagesResult.ocr_result.document_id, ocrPagesResult.page_number])}
                                        >{t('Download')}</a>
                                        <a
                                            className="btn btn-primary join-item"
                                            href={route('user.ocr.analyze-result-review', [ocrPagesResult.ocr_result.document_id, ocrPagesResult.page_number])}
                                        >{t('Review Analysis Data')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>{t('No data available.')}</p>
            )}
        </UserLayout>
    );
};

export default Index;
