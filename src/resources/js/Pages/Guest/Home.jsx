import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Home({
    auth,
    lang
}) {
    const { t } = useTranslation();

    return (
        <GuestLayout
            user={auth.user}
            header={t('Home Page')}
            lang={lang}
        >
            <Head title={t('Home Page')} />

            <div className="">
                <div className="p-6">{t('とっぷぺーじ')}</div>
            </div>
        </GuestLayout>
    )
}
