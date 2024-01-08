import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Top({
    auth,
    lang
}) {
    const { t } = useTranslation();

    return (
        <GuestLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('Dashboard')}</h2>}
            lang={lang}
        >
            <Head title={t('Top page')} />

            <div className="">
                <div className="p-6 text-gray-900">{t('とっぷぺーじ')}</div>
            </div>
        </GuestLayout>
    )
}
