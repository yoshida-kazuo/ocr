import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { DashboardProps } from '@/Interfaces/Pages';

const Dashboard: React.FC<DashboardProps> = ({
    auth,
    lang,
    timezone,
    requests = ''
}) => {
    const { t } = useTranslation();

    return (
        <UserLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('Dashboard')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Dashboard')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-md">
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

                <div className="p-6 text-gray-900">{t('You\'re logged in!')}</div>
            </div>
        </UserLayout>
    );
};

export default Dashboard;
