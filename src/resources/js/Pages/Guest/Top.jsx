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
            header={t('Top page')}
            lang={lang}
        >
            <Head title={t('Top page')} />

            <div className="">
                <div className="p-6 text-gray-900">{t('とっぷぺーじ')}</div>
            </div>
        </GuestLayout>
    )
}
