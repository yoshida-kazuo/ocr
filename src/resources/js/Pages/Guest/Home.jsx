import { useRef, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
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
        topic_type: '',
        is_published: false,
    });

    const submit = (ev) => {
        ev.preventDefault();

        post(route('member.post.store'), {
            onSuccess: resource => closeModal()
        });
    };
    const editSubmit = (ev) => {
        ev.preventDefault();

        put(route('member.post.update'), {
            onSuccess: resource => closeModal()
        })
    };
    const deleteSubmit = (ev) => {
        ev.preventDefault();

        destroy(route('member.post.delete'), {
            onSuccess: resource => closeModal()
        })
    };

    const newPostModal = () => {
        setData({
            id: '',
            body: '',
            topic_type: '',
            is_published: false
        });
        setMode('new');
        modalWriter.current.showModal();
    };
    const editPostModal = ({
        id,
        body,
        topic_type,
        is_published
    }) => {
        setData({
            id: id,
            body: body,
            topic_type: topic_type,
            is_published: is_published
        });
        setMode('edit');
        modalWriter.current.showModal();
    };
    const deletePostModal = ({ id }) => {
        setData({
            id: id
        });
        setConfirmingPostDeletion(true);
    };

    const closeModal = () => {
        setConfirmingPostDeletion(false);
        modalWriter.current.close();

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

            <div className="w-full">
                {auth.user?.role_id < 9 && auth.user && (
                    <div className="w-full my-4 sticky top-16 z-10">
                        <div className="m-auto w-32">
                            <PrimaryButton
                                onClick={newPostModal}
                            >{t('Open the post window')}</PrimaryButton>
                        </div>
                    </div>
                )}

                <div className="sm:flex sm:flex-wrap sm:items-start sm:w-[45rem] sm:min-w-[45rem] mx-auto">
                    {posts.data.length ? posts.data?.map(post => (
                        <div key={post.id} className="card sm:w-[45rem] bg-base-100 m-2">
                            <div className="card-body p-6">
                                <Markdown
                                    className="markdown text-wrap break-words"
                                    remarkPlugins={[remarkGfm]}
                                >{post.body}</Markdown>

                                {auth.user?.role_id < 9 && (
                                    <p className="flex justify-end text-sm text-wrap break-words">
                                        <span className="mr-2">{post.user.name}</span>
                                        <span>{post.created_at}</span>
                                    </p>
                                )}

                                {auth.user?.role_id < 9 && post.user_id === auth.user?.id && (
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
                    )) : (
                        <div className="text-lg w-full text-center">
                            {t('There are no posts.')}
                        </div>
                    )}
                </div>

                <dialog ref={modalWriter} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box sm:w-[45rem] sm:max-w-[45rem]">
                        <h3 className="font-bold text-lg">{t('Post')}</h3>
                        <div className="mt-2">
                            <TextArea
                                id="body"
                                className="input-bordered h-72 w-auto"
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                            />

                            <InputError className="mt-2" message={errors.body} />
                        </div>

                        <div>
                            <InputLabel htmlFor="topic_type" value={t('Tpick Type')} />

                            <TextInput
                                id="topic_type"
                                className="input-bordered w-auto"
                                value={data.topic_type}
                                onChange={(e) => setData('topic_type', e.target.value)}
                            />

                            <InputError className="mt-2" message={errors.topic_type} />
                        </div>

                        <div>
                            <InputLabel htmlFor="is_published" value={t('Switch Display')} />

                            <Toggle
                                id="is_published"
                                checked={data.is_published}
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
