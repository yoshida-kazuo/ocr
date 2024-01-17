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

            <div className="p-4">
                <div>{t('We are currently preparing.')}</div>
            </div>
        </GuestLayout>
    )
}
