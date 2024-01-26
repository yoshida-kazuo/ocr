import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({
    auth,
    lang,
    timezone,
    requests=''
}) {
    const { t } = useTranslation();

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('Dashboard')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Dashboard')} />

            <div className="overflow-hidden shadow-sm sm:rounded-md">
                {requests === 'complete-email-verification' && (
                    <div role="alert" className="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>
                            <Link
                                href={route('verification.notice', {"requests": "email-authentication-required"})}
                            >
                                {t('Please complete email verification.')}
                            </Link>
                        </span>
                    </div>
                )}

                <div className="p-6">{t('You\'re logged in!')}</div>
            </div>
        </AdminLayout>
    );
}
