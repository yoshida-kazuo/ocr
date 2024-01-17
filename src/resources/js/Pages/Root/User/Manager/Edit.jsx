import { useEffect } from 'react';
import RootLayout from '@/Layouts/RootLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Toggle from '@/Components/Toggle';
import Toast from '@/Components/Toast';

export default function Edit({
    auth,
    timezone,
    lang,
    user,
    roles,
    errors
}) {
    const { t } = useTranslation();
    const {
        data,
        setData,
        patch,
        reset,
        delete: destroy,
        processing,
        recentlySuccessful
    } = useForm({
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        is_login_prohibited: user.login_ban_at ? true : false,
        is_restore: false
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('root.user.manager.update', { id: user.id }), {
            preserveScroll: true
        });
    };

    const deleteHandle = (e) => {
        e.preventDefault();

        destroy(route('root.user.manager.delete', { id: user.id }), {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) {
            reset();
        }
    }, [recentlySuccessful]);

    return (
        <RootLayout
            user={auth.user}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('User information')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('User information')} />

            <div className="p-4 shadow sm:rounded-md">
                <form onSubmit={submit} className="space-y-6">
                    <section className="max-w-xl">
                        <h3 className="flex items-center text-lg">
                            <span className="flex-shrink-0">{t('ID')} {user.id}</span>
                            {user.deleted_at && (
                                <span className="flex-shrink-0 ml-2">{t('Removed')}</span>
                            )}
                        </h3>

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
                                className="select select-bordered w-full max-w-xs"
                            />

                            <InputError className="mt-2" message={errors.role_id} />
                        </div>

                        <div>
                            <InputLabel htmlFor="is_login_prohibited" value={t('Login prohibition status')} />

                            <Toggle
                                id="is_login_prohibited"
                                onChange={(e) => setData('is_login_prohibited', e.target.checked)}
                                defaultChecked={data.is_login_prohibited}
                            />

                            <InputError className="mt-2" message={errors.is_login_prohibited} />
                        </div>

                        {user.deleted_at && (
                            <div>
                                <InputLabel htmlFor="is_restore" value={t('Restore Account')} />

                                <Toggle
                                    id="is_restore"
                                    onChange={(e) => setData('is_restore', e.target.checked)}
                                    checked={data.is_restore}
                                    disabled={! user.deleted_at}
                                />

                                <InputError className="mt-2" message={errors.is_restore} />
                            </div>
                        )}

                        <div>
                            <InputLabel value={t('Last Updated')} />

                            <p className="mt-2 text-sm">{user.updated_at}</p>
                        </div>

                        <div>
                            <InputLabel value={t('Registration datetime')} />
                            <p className="mt-2 text-sm">{user.created_at}</p>
                        </div>

                        <div>
                            <InputLabel value={t('Login prohibition time/date')} />
                            <p className="mt-2 text-sm">{user.login_ban_at || '-'}</p>
                        </div>

                        <div>
                            <InputLabel value={t('Deleted At')} />
                            <p className="mt-2 text-sm">{user.deleted_at || '-'}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <PrimaryButton disabled={processing}>{t('Register')}</PrimaryButton>

                            {! user.deleted_at && (
                                <DangerButton className="ml-3" disabled={processing} onClick={deleteHandle}>
                                    {t('Delete Account')}
                                </DangerButton>
                            )}

                            <Toast
                                show={recentlySuccessful}
                                message={t('You have been registered.')}
                            />
                        </div>
                    </section>
                </form>
            </div>
        </RootLayout>
    )
}
