import { useEffect, useRef, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import Toggle from '@/Components/Toggle';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Toast from '@/Components/Toast';
import Modal from '@/Components/Modal';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { XCircleIcon, PencilAltIcon, EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

export default function Home({
    auth,
    lang,
    timezone,
    posts,
    errors
}) {
    const { t } = useTranslation();
    const [mode, setMode] = useState('new');
    const modalWriter = useRef(null);
    const [confirmingPostDeletion , setConfirmingPostDeletion] = useState(false);
    const { data, setData, post, put, delete: destroy, reset, processing, recentlySuccessful } = useForm({
        id: '',
        body: '',
        is_published: '',
    });

    const submit = (ev) => {
        ev.preventDefault();

        post(route('member.post.store'), {
            onSuccess: resource => modalWriter.current.close()
        });
    };
    const editSubmit = (ev) => {
        ev.preventDefault();
        console.log(data);

        put(route('member.post.update'), {
            onSuccess: resource => modalWriter.current.close()
        })
    };
    const deleteSubmit = (ev) => {
        ev.preventDefault();

        destroy(route('member.post.delete'), {
            onSuccess: resource => closeModal()
        })
    };

    const newPostModal = () => {
        reset();
        setData('is_published', false);
        setMode('new');
        modalWriter.current.showModal();
    };
    const editPostModal = ({ id, body, is_published }) => {
        reset();
        setData({
            id: id,
            body: body,
            is_published: is_published
        });
        setMode('edit');
        modalWriter.current.showModal();
    };
    const deletePostModal = ({ id }) => {
        reset();
        setData({
            id: id
        });
        setConfirmingPostDeletion(true);
    };
    const closeModal = () => {
        setConfirmingPostDeletion(false);

        reset();
    };

    return (
        <GuestLayout
            user={auth.user}
            header={t('Home Page')}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Home Page')} />

            <div className="sm:p-4">
                <div className="w-full">
                    <div className="sm:flex sm:flex-wrap sm:items-start sm:w-[calc(24rem*3)] mx-auto">
                        {auth.user && (
                            <div className="w-full mb-4">
                                <div className="m-auto w-32 z-10">
                                    <PrimaryButton
                                        onClick={newPostModal}
                                    >{t('Open the post window')}</PrimaryButton>
                                </div>
                            </div>
                        )}

                        {posts.data?.map(post => (
                            <div key={post.id} className="card sm:w-[23rem] bg-base-100 m-2 shadow-sm">
                                <div className="card-body">
                                    <Markdown
                                        className="markdown text-wrap break-words"
                                        remarkPlugins={[remarkGfm]}
                                    >{post.body}</Markdown>
                                    <p className="text-sm inline-block text-wrap break-words">
                                        <span className="mr-2">{post.created_at}</span>
                                        <span>{post.user.name}</span>
                                    </p>

                                    {post.user_id === auth.user?.id && (
                                        <div className="flex justify-end">
                                            <span className="mr-2">
                                                {post.is_published ? (
                                                    <EyeIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                                ) : (
                                                    <EyeOffIcon className="text-base-300 flex-shrink-0 w-5 h-5 transition duration-75" />
                                                )}
                                            </span>
                                            <button className="mr-2" onClick={(e) => editPostModal(post)}>
                                                <PencilAltIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                            </button>
                                            <button onClick={(e) => deletePostModal(post)}>
                                                <XCircleIcon className="flex-shrink-0 w-5 h-5 transition duration-75 text-error" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <dialog ref={modalWriter} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{t('Post')}</h3>
                        <div className="mt-2">
                            <TextArea
                                id="body"
                                className="h-72 w-auto"
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                            />

                            <InputError className="mt-2" message={errors.body} />
                        </div>

                        <div>
                            <InputLabel htmlFor="is_published" value={t('Switch Display')} />

                            <Toggle
                                id="is_published"
                                defaultChecked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked ? true : false)}
                            />

                            <InputError className="mt-2" message={errors.is_published} />
                        </div>

                        <InputError className="mb-2" message={errors.id} />
                        <InputError className="mt-2" message={errors._other_} />

                        <div className="modal-action">
                            <div className="join">
                                <form onSubmit={mode === 'new' ? submit : editSubmit}>
                                    <PrimaryButton
                                        disabled={processing}
                                        className="join-item"
                                    >{t('Register')}</PrimaryButton>
                                </form>
                                <form method="dialog">
                                    <button
                                        className="btn join-item"
                                    >{t('Cancel')}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </dialog>

                <Modal show={confirmingPostDeletion} onClose={closeModal}>
                    <form className="p-6 bg-base-100">
                        <h2 className="text-lg font-medium">
                            {t('Do you want to delete?')}
                        </h2>
                        <div className="flex justify-end join mt-2">
                            <InputError className="mb-2" message={errors.id} />

                            <SecondaryButton
                                className="join-item"
                                onClick={closeModal}
                            >{t('Cancel')}</SecondaryButton>
                            <DangerButton
                                className="join-item"
                                disabled={processing}
                                onClick={deleteSubmit}
                            >{t('Delete')}</DangerButton>
                        </div>
                    </form>
                </Modal>

                <Toast
                    show={recentlySuccessful}
                    message={t('You have been registered.')}
                />
            </div>
        </GuestLayout>
    )
}
