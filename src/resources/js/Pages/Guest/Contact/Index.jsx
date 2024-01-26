import React, { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import Toast from '@/Components/Toast';

export default function Index({
    auth,
    lang,
    errors
}) {
    const { t } = useTranslation();
    const { data, setData, post, reset, processing, recentlySuccessful } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('contact.send'));
    };

    useEffect(() => {
        if (recentlySuccessful) {
            reset();
        }
    }, [recentlySuccessful, reset]);

    return (
        <GuestLayout
            user={auth.user}
            header={t('Contact')}
            lang={lang}
        >
            <Head title={t('Contact')} />

            <section className="mx-auto w-9/12">
                <header className="mb-4">
                    <h2 className="font-semibold text-xl leading-tight">{t('Contact')}</h2>
                </header>

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value={t('Name')} />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="mt-2">
                        <InputLabel htmlFor="email" value={t('Email')} />

                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div className="mt-2">
                        <InputLabel htmlFor="message" value={t('Please enter the inquiry details.')} />

                        <TextArea
                            id="message"
                            value={data.message}
                            className="h-36"
                            onChange={(e) => setData('message', e.target.value)}
                            required
                        />

                        <InputError className="mt-2" message={errors.message} />
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <PrimaryButton disabled={processing}>{t('Send')}</PrimaryButton>

                        <Toast
                            show={recentlySuccessful}
                            message={t('You have been registered.')}
                        />
                    </div>
                </form>
            </section>
        </GuestLayout>
    );
}
