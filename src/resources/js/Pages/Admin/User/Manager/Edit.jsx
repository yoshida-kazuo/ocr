import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Toggle from '@/Components/Toggle';

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
        delete: destroy,
        processing,
        recentlySuccessful
    } = useForm({
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        is_deleted: user.deleted_at ? true : false,
        is_login_prohibited: user.login_ban_at ? true : false,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('admin.user.manager.update', { id: user.id }));
    };

    const restoreHandle = (e) => {
        e.preventDefault();
        setData('is_deleted', false);

        patch(route('admin.user.manager.update', { id: user.id }));
    };

    const deleteHandle = (e) => {
        e.preventDefault();
        setData('is_deleted', true);

        destroy(route('admin.user.manager.delete', { id: user.id }));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('User information')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('User information')} />

            <form onSubmit={submit} className="mt-6 space-y-6">
                <h3 className="flex items-center text-lg"><span className="flex-shrink-0">{t('ID')} {user.id}</span>{user.deleted_at && (
                    <span className="flex-shrink-0 ml-2 text-red-800">{t('Removed')}</span>
                )}</h3>
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

                <div>
                    <InputLabel value={t('Last Updated')} />

                    <p className="mt-2 text-sm text-gray-600">{user.updated_at}</p>
                </div>

                <div>
                    <InputLabel value={t('Registration datetime')} />
                    <p className="mt-2 text-sm text-gray-600">{user.created_at}</p>
                </div>

                <div>
                    <InputLabel value={t('Login prohibition time/date')} />
                    <p className="mt-2 text-sm text-gray-600">{user.login_ban_at || '-'}</p>
                </div>

                <div>
                    <InputLabel value={t('Deleted At')} />
                    <p className="mt-2 text-sm text-gray-600">{user.deleted_at || '-'}</p>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('Register')}</PrimaryButton>

                    {user.deleted_at ? (
                        <SecondaryButton className="ml-3" disabled={processing} onClick={restoreHandle}>
                            {t('Restore Account')}
                        </SecondaryButton>
                    ) : (
                        <DangerButton className="ml-3" disabled={processing} onClick={deleteHandle}>
                            {t('Delete Account')}
                        </DangerButton>
                    )}

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
        </AdminLayout>
    )
}

