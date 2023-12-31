import { useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Dashboard({
    auth,
    lang,
    timezone
}) {
    const { t } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <UserLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('Dashboard')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Dashboard')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">{t('You\'re logged in!')}</div>
            </div>
        </UserLayout>
    );
}
