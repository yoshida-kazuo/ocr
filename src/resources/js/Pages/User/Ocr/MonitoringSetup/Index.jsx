import React, { useState, useRef, useCallback } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import { XCircleIcon, PencilAltIcon } from '@heroicons/react/solid';
import Pagination from '@/Components/Pagination';

const OPTIONS = [
    { value: 0, label: 'Disable' },
    { value: 1, label: 'Enable' },
];
const STORAGES = [
    { value: '', label: '' },
    { value: 'local', label: 'local' },
    { value: 's3', label: 's3' },
];
const SERVICES = [
    { value: 'tesseract-v1', label: 'tesseract-v1' },
    { value: 'tesseract-v2', label: 'tesseract-v2' },
    { value: 'easyocr-v1', label: 'easyocr-v1' },
    { value: 'paddleocr-v1', label: 'paddleocr-v1' },
    { value: 'azure-v1', label: 'azure-v1' },
];

const MonitoringSetup = ({
    auth,
    lang,
    timezone,
    watchedFolders
}) => {
    const { t } = useTranslation();
    const { data, setData, post, put, delete: destroy, reset, errors, processing, recentlySuccessful } = useForm({
        service: '',
        storage: '',
        folder_path: '',
        is_active: false,
    });

    const [mode, setMode] = useState();
    const [deleteDirection, setDeleteDirection] = useState(false);

    const modalRef = useRef();

    const handleNewSubmit = useCallback((ev) => {
        ev.preventDefault();

        post(route('user.ocr.monitoring-setup.store'), {
            onSuccess: resource => closeModal()
        });
    }, [post]);
    const handleEditSubmit = useCallback((ev) => {
        ev.preventDefault();

        put(route('user.ocr.monitoring-setup.update'), {
            onSuccess: resource => closeModal()
        });
    }, [put]);
    const handleDeleteSubmit = useCallback((ev) => {
        ev.preventDefault();

        destroy(route('user.ocr.monitoring-setup.delete'), {
            onSuccess: resource => closeModal()
        });
    }, [destroy]);

    const newModal = useCallback(() => {
        setData({
            id: '',
            service: 'tesseract-v1',
            storage: '',
            folder_path: '',
            is_active: false,
        });
        setMode('new');

        modalRef.current.showModal();
    }, [modalRef]);
    const editModal = useCallback(({
        id,
        service,
        storage,
        folder_path,
        is_active,
        ocr_results_count
    }) => {
        setData({
            id: id,
            service: service,
            storage: storage,
            folder_path: folder_path,
            is_active: is_active,
            ocr_results_count: ocr_results_count
        });
        setMode('edit');

        modalRef.current.showModal();
    }, [modalRef]);
    const deleteModal = useCallback(({ id }) => {
        setData({
            id: id,
        });
        setDeleteDirection(true);
    }, []);

    const closeModal = useCallback(() => {
        setDeleteDirection(false);
        modalRef.current.close();

        reset();
    }, [modalRef]);

    return (
        <UserLayout
            user={auth.user}
            timezone={timezone}
            lang={lang}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('Monitoring Setup')}</h2>}
        >
            <Head title={t('Monitoring Setup')} />

            <div className="w-full">
                <PrimaryButton
                    onClick={newModal}
                >{t('New Monitoring Folder')}</PrimaryButton>
            </div>

            {watchedFolders.total > 0 && (
                <div className="p-4 shadow sm:rounded-md mt-2">
                    <div className="overflow-x-auto mb-9">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('Folder Path')}</th>
                                    <th>{t('Number of analyses')}</th>
                                    <th>{t('Disk Storage')}</th>
                                    <th>{t('Ocr Service')}</th>
                                    <th>{t('Is Active')}</th>
                                    <th>{t('Registration datetime')}</th>
                                </tr>
                            </thead>
                            {watchedFolders?.data?.map(watchedFolder => (
                                <tbody key={watchedFolder.id}>
                                    <tr>
                                        <td className="flex">
                                            {watchedFolder.folder_path}
                                            <button
                                                onClick={(e) => editModal(watchedFolder)}
                                                className="ml-3"
                                            >
                                                <PencilAltIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                            </button>
                                            <button
                                                onClick={(ev) => deleteModal(watchedFolder)}
                                                className="ml-1"
                                            >
                                                <XCircleIcon className="flex-shrink-0 w-5 h-5 transition duration-75 text-error" />
                                            </button>
                                        </td>
                                        <td>
                                            <div className="badge badge-secondary">{watchedFolder.ocr_results_count}</div>
                                        </td>
                                        <td>
                                            <div className="badge badge-ghost badge-sm">
                                                {watchedFolder.storage}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="badge badge-ghost badge-sm">
                                                {SERVICES.filter(service => service.value === watchedFolder.service)[0].label}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="badge badge-secondary">
                                                {OPTIONS.filter(option => option.value === watchedFolder.is_active)[0].label}
                                            </div>
                                        </td>
                                        <td>{watchedFolder.updated_at}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>

                    <Pagination items={watchedFolders} />
                </div>
            )}

            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box sm:w-[45rem] sm:max-w[45rem]">
                    <h3 className="font-bold text-lg">
                        {t('Monitoring Setup')}
                    </h3>
                    <div>
                        <InputLabel htmlFor="folder_path" value={t('Folder Name')} />
                        <TextInput
                            id="folder_path"
                            className="mt-1 block w-full"
                            value={data.folder_path}
                            onChange={(e) => setData('folder_path', e.target.value)}
                            isFocused
                            autoComplete="folder_path"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>
                    <div className="mt-2">
                        <InputLabel htmlFor="storage" value={t('Please select the storage engine to be used.')} />
                        <Select
                            id="storage"
                            options={STORAGES}
                            value={data.storage}
                            onChange={(e) => setData('storage', e.target.value)}
                            className="select select-bordered"
                        />
                        <InputError className="mt-2" message={errors.storage} />
                    </div>
                    <div className="mt-2">
                        <InputLabel htmlFor="service" value={t('Please select the OCR service to be used for analysis.')} />
                        <Select
                            id="service"
                            options={SERVICES}
                            value={data.service}
                            onChange={(e) => setData('service', e.target.value)}
                            className="select select-bordered"
                        />
                        <InputError className="mt-2" message={errors.service} />
                    </div>
                    <div className="mt-2">
                        <InputLabel htmlFor="is_active" value={t('Enable selected folder')} />
                        <Select
                            id="is_active"
                            options={OPTIONS}
                            value={data.is_active}
                            onChange={(e) => setData('is_active', e.target.value)}
                            className="select select-bordered"
                        />
                        <InputError className="mt-2" message={errors.is_active} />
                    </div>
                    <div className="modal-action">
                        <div className="join">
                            <form method="dialog">
                                <button
                                    className="btn join-item"
                                >{t('Cancel')}</button>
                            </form>
                            <form onSubmit={ mode === 'new' ? handleNewSubmit : handleEditSubmit }>
                                <PrimaryButton
                                    disabled={processing}
                                    className="join-item"
                                >{t('Register')}</PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </dialog>

            <Modal show={deleteDirection} onClose={closeModal}>
                <form className="p-6 bg-base-100">
                    <h2 className="text-lg font-medium">
                        {t('Do you want to delete?')}
                    </h2>
                    <div className="flex justify-end join mt-2">
                        <InputError className="mb-2" message={errors.id} />
                        <button
                            className="btn join-item"
                            onClick={ev => {
                                ev.preventDefault();
                                closeModal();
                            }}
                        >{t('Cancel')}</button>
                        <DangerButton
                            className="btn-error join-item"
                            disabled={processing}
                            onClick={handleDeleteSubmit}
                        >{t('Delete')}</DangerButton>
                    </div>
                </form>
            </Modal>
        </UserLayout>
    );
};

export default MonitoringSetup;
