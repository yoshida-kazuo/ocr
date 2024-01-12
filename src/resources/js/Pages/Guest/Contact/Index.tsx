import React, { FormEvent, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import { ContactIndexProps } from '@/Interfaces/Pages';

const Index: React.FC<ContactIndexProps> = ({
    auth,
    lang,
    errors
}) => {
    const { t } = useTranslation();
    const { data, setData, post, reset, processing, recentlySuccessful } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('contact.send'));
    };

    useEffect(() => {
        if (recentlySuccessful) {
            reset();
        }
    }, [recentlySuccessful]);

    return (
        <GuestLayout
            user={auth.user}
            header={t('Contact')}
            lang={lang}
        >
            <Head title={t('Contact')} />

            <section className="mx-auto w-9/12">
                <header>
                    <h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('Contact')}</h2>
                </header>

                <form onSubmit={submit} className="mt -6 space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value={t('Name')} />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e:any) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value={t('Email')} />

                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e:any) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="message" value={t('Please enter the inquiry details.')} />

                        <TextArea
                            id="message"
                            value={data.message}
                            className="h-36"
                            onChange={(e:any) => setData('message', e.target.value)}
                            required
                        />

                        <InputError className="mt-2" message={errors.message} />
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>{t('Send')}</PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600">{t('I have sent it.')}</p>
                        </Transition>
                    </div>
                </form>
            </section>
        </GuestLayout>
    );
};

export default Index;
