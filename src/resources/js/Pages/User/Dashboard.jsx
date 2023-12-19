import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { DocumentSearchIcon } from '@heroicons/react/solid';

export default function Dashboard({
    auth,
    lang,
    timezone,
    requests='',
    isProvider,
    ocrPagesResultCount
}) {
    const { t } = useTranslation();

    return (
        <UserLayout
            user={auth.user}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('Dashboard')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Dashboard')} />

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
            {isProvider && (
                <div role="alert" className="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>
                        <Link
                            href={route('profile.edit')}
                        >
                            {t('Please register your email address.')}
                        </Link>
                    </span>
                </div>
            )}

            <div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <DocumentSearchIcon className="flex-shrink-0 w-9 h-9 transition duration-75" />
                        </div>
                        <div className="stat-title">{t('Total OCR analyses')}</div>
                        <div className="stat-value text-primary">{ocrPagesResultCount}</div>
                        <div className="stat-desc"><a href={route('user.ocr.analyze')}>{t('Review analysis data')}</a></div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
