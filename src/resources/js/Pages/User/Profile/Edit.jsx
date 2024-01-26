import UserLayout from '@/Layouts/UserLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
    lang,
    timezone,
    isProvider
}) {
    const { t } = useTranslation();

    return (
        <UserLayout
            user={auth.user}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('Profile')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Profile')} />

            <div className="p-4 shadow sm:rounded-md mb-4">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="max-w-xl"
                    isProvider={isProvider}
                />
            </div>

            <div className="p-4 shadow sm:rounded-md mb-4">
                <UpdatePasswordForm className="max-w-xl" />
            </div>

            <div className="p-4 shadow sm:rounded-md">
                <DeleteUserForm className="max-w-xl" />
            </div>
        </UserLayout>
    );
}
