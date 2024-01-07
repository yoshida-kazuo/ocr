import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Index({
    auth,
    lang,
    errors
}) {
    const { t } = useTranslation();

    return (
        <GuestLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('Dashboard')}</h2>}
            lang={lang}
        >
            <Head title={t('Contact')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-md">
                <div className="p-6 text-gray-900">{t('おといあわせ')}</div>
            </div>
        </GuestLayout>
    );
}
