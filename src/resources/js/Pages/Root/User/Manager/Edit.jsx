import { useEffect } from 'react';
import RootLayout from '@/Layouts/RootLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';

export default function Edit({
    auth,
    timezone,
    lang,
    user,
    roles,
    errors
}) {
    const { t } = useTranslation();
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        role_id: user.role_id
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('root.user.manager.edit', { id: user.id }));
    };

    return (
        <RootLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('User information')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('User information')} />

            <form onSubmit={submit} className="mt-6 space-y-6">
                <h3 className="text-lg">{t('ID')} {user.id}</h3>
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

                <div>
                    <InputLabel htmlFor="email" value={t('Email')} />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="role_id" value={t('Role')} />

                    <Select
                        id="role_id"
                        options={roles}
                        value={data.role_id}
                        onChange={(e) => setData('role_id', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.role_id} />
                </div>

                <div>
                    <InputLabel value={t('Last Updated')} />

                    <p className="mt-2 text-sm text-gray-600">{user.updated_at}</p>
                </div>

                <div>
                    <InputLabel value={t('Registration datetime')} />
                    <p className="mt-2 text-sm text-gray-600">{user.created_at}</p>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('Register')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">{t('You have been registered.')}</p>
                    </Transition>
                </div>
            </form>
        </RootLayout>
    )
}
