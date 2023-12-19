import React, { useState, useCallback } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/Components/Pagination';
import Checkbox from '@/Components/Checkbox';
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
    ocrResults,
}) => {
    const { t } = useTranslation();
    const { url } = usePage();

    const [documentIds, setDocumentIds] = useState([]);

    const handlCheckboxChange = useCallback((ev) => {
        const { checked, value } = ev.target;

        setDocumentIds(prevDocumentIds => {
            if (checked) {
                return [...prevDocumentIds, value];
            } else {
                return prevDocumentIds.filter(documentId => documentId !== value);
            }
        });
    }, [setDocumentIds]);
    const handleDocumentDelete = useCallback((ev) => {
        ev.preventDefault();

        axios.delete(route('user.ocr.analyze.destroy'), {
                data: {
                    documentIds: documentIds
                }
            })
            .then(() => router.visit(url))
            .catch(error => {
                console.error(error);
            });
    }, [documentIds]);

    return (
        <UserLayout
            user={auth.user}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('OCR analyses list')} />

            <div className="text-sm breadcrumbs pt-0">
                <ul>
                    <li><a href={route('user.dashboard')}>{t('Dashboard')}</a></li>
                    <li>{t('OCR analyses list')}</li>
                </ul>
            </div>

            <div className="p-4 shadow sm:rounded-md mt-2">
                {ocrResults.total > 0 ? (
                    <>
                        <div className="overflow-x-auto mb-9">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="dropdown dropdown-end">
                                                <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                                                </div>
                                                <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box">
                                                    <li>
                                                        <button
                                                            className="btn btn-error"
                                                            onClick={handleDocumentDelete}
                                                            disabled={! documentIds.length}
                                                        >{t('Delete')}</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </th>
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
                                                <label>
                                                    <Checkbox
                                                        value={ocrResult.document_id}
                                                        onChange={handlCheckboxChange}
                                                    />
                                                </label>
                                            </td>
                                            <td>
                                                <a href={route('user.ocr.analyze-result', [ocrResult.document_id])}>
                                                    {ocrResult.document_name || '-'}
                                                    <div className="text-sm opacity-50">
                                                        {ocrResult.document_id}
                                                    </div>
                                                </a>
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
                                                    {SERVICES.filter(service => service.value === ocrResult.service)[0]?.label || ocrResult.service}
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
