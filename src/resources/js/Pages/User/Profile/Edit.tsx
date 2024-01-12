import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { EditProps } from '@/Interfaces/Pages';

const Edit: React.FC<EditProps> = ({
    auth,
    mustVerifyEmail,
    status,
    lang,
    timezone
}) => {
    const { t } = useTranslation();

    return (
        <UserLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('Profile')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Profile')} />

            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-md">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="max-w-xl"
                />
            </div>

            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-md">
                <UpdatePasswordForm className="max-w-xl" />
            </div>

            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-md">
                <DeleteUserForm className="max-w-xl" />
            </div>
        </UserLayout>
    );
};

export default Edit;
