import { useEffect, useRef, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import useApi from '@/Hooks/useApi';

export default function Home({
    auth,
    lang,
    timezone
}) {
    const { t } = useTranslation();
    const [disablePost, setDisablePost] = useState(false);
    const [posts, setPosts] = useState({});
    const modalWriter = useRef(null);
    const { data, setData, reset } = useForm({
        body: '',
    });
    const { post, get, errors } = useApi();

    const submit = (ev) => {
        ev.preventDefault();

        setDisablePost(true);

        post(route('api.user.post.store'), { data: data })
            .then(response => {
                catalog();
                modalWriter.current.close();
            })
            .finally(() => {
                setDisablePost(false);
                reset();
            });
    };
    const catalog = () => {
        get(route('api.user.post'))
            .then(response => {
                setPosts(response.data);
            });
    };

    useEffect(() => {
        catalog();
    }, []);

    return (
        <GuestLayout
            user={auth.user}
            header={t('Home Page')}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Home Page')} />

            <div className="p-4">
                <div className="w-full">
                    <div className="flex flex-wrap w-[calc(24rem*3)] mx-auto">
                        <div className="w-full">
                            <PrimaryButton
                                onClick={()=>modalWriter.current.showModal()}
                            >{t('open modal')}</PrimaryButton>
                        </div>

                        {posts?.data?.map(post => (
                            <div key={post.id} className="card w-[23rem] bg-base-100 shadow-md m-2">
                                <div className="card-body">
                                    <p>{post.body}</p>
                                    <p>{post.user.name}</p>
                                    <p>{post.created_at}</p>
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

                        <InputError className="mt-2" message={errors._other_} />

                        <div className="modal-action">
                            <form onSubmit={submit}>
                                <PrimaryButton disabled={disablePost}>{t('Register')}</PrimaryButton>
                            </form>
                            <form method="dialog">
                                <button className="btn">{t('Close')}</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </GuestLayout>
    )
}
