import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const SERVICES = [
    { value: 'tesseract-v1', label: 'OCR Engine V1' },
    { value: 'tesseract-v2', label: 'OCR Engine V1.1' },
    { value: 'easyocr-v1', label: 'OCR Engine V2' },
    { value: 'paddleocr-v1', label: 'OCR Engine V3' },
    { value: 'azure-v1', label: 'OCR Engine V4' },
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

    return (
        <UserLayout
            user={auth.user}
            timezone={timezone}
            lang={lang}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('List of Analyzed Data')}</h2>}
        >
            <Head title={t('List of Analyzed Data')} />

            <h3 className="mb-3">
                {`${t('Document ID')}: ${ocrResult.document_id}`}<br />
                <div className="badge badge-ghost badge-sm">{ocrResult.service}</div>
                <span className="text-sm opacity-50 ml-3">{ocrResult.updated_at}</span>
            </h3>

            {ocrPagesResults.total > 0 ? (
                <div className="flex flex-wrap">
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
                                    <div className="card-actions justify-end">
                                        <a
                                            className="btn btn-primary"
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
