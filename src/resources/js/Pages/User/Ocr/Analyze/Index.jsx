import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/Components/Pagination';

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
    ocrResults,
}) => {
    const { t } = useTranslation();

    return (
        <UserLayout
            user={auth.user}
            timezone={timezone}
            lang={lang}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('List of analyses')}</h2>}
        >
            <Head title={t('List of analyses')} />

            <div className="p-4 shadow sm:rounded-md mt-2">
                {ocrResults.total > 0 ? (
                    <>
                        <div className="overflow-x-auto mb-9">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            {t('Document Name')}<br />
                                            {t('Document ID')}
                                        </th>
                                        <th>{t('Page Number')}</th>
                                        <th>{t('Analyzed Page Count')}</th>
                                        <th>
                                            {t('Ocr Service')}<br />
                                            {t('Disk Storage')}<br />
                                            {t('Watched Folder')}
                                        </th>
                                        <th>{t('Registration datetime')}</th>
                                    </tr>
                                </thead>
                                {ocrResults?.data?.map(ocrResult => (
                                    <tbody key={ocrResult.id}>
                                        <tr>
                                            <td>
                                                {ocrResult.document_name || '-'}
                                                <div className="text-sm opacity-50">
                                                    <a href={route('user.ocr.analyze-result', [ocrResult.document_id])}>{ocrResult.document_id}</a>
                                                </div>
                                            </td>
                                            <td>
                                                {ocrResult.page_number}
                                            </td>
                                            <td>
                                                <div className="badge badge-secondary ml-3">
                                                    {ocrResult.ocr_pages_results_count}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="badge badge-ghost badge-sm">
                                                    {SERVICES.filter(service => service.value === ocrResult.service)[0]?.label || '-'}
                                                </div><br />
                                                <div className="badge badge-ghost badge-sm">
                                                    {ocrResult.storage || '-'}
                                                </div><br/>
                                                <div className="badge badge-secondary badge-sm">
                                                    {ocrResult.watched_folder?.folder_path || '-'}
                                                </div>
                                            </td>
                                            <td>{ocrResult.updated_at}</td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>

                        <Pagination items={ocrResults} />
                    </>
                ) : (
                    <p>{t('No data available.')}</p>
                )}
            </div>
        </UserLayout>
    );
}

export default Index;
