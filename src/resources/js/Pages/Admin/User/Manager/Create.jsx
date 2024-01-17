import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Toast from '@/Components/Toast';

export default function Create({
    auth,
    timezone,
    lang,
    errors
}) {
    const { t } = useTranslation();
    const {
        data,
        setData,
        post,
        processing,
        recentlySuccessful
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.user.manager.store'));
    }

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('Create User')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Create User')} />

            <div className="p-4 shadow sm:rounded-md">
                <form onSubmit={submit} className="space-y-6">
                    <section className="max-w-xl">
                        <header>
                            <h3 className="flex items-center text-lg">{t('Profile Information')}</h3>
                        </header>

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
                                autoComplete="email"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value={t('Password')} />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value={t('Confirm Password')} />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <PrimaryButton disabled={processing}>{t('Register')}</PrimaryButton>

                            <Toast
                                show={recentlySuccessful}
                                message={t('You have been registered.')}
                            />
                        </div>
                    </section>
                </form>
            </div>
        </AdminLayout>
    );
}
