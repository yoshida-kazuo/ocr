import React, { FormEvent } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { AuthVerifyEmailProps } from '@/Interfaces/Pages';

const VerifyEmail: React.FC<AuthVerifyEmailProps> = ({
    status,
    lang,
    timezone,
    requests
}) => {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout timezone={timezone} lang={lang}>
            <Head title={t('Email Verification')} />

            {requests === 'email-authentication-required' ? (
                <div className="mb-4 text-sm text-gray-800">
                    {t('Please complete email verification.')}
                </div>
            ) : (
                <div className="mb-4 text-sm text-gray-600">
                    {t(`Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.`)}
                </div>
            )}

            {status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {t('A new verification link has been sent to the email address you provided during registration.')}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>{t('Resend Verification Email')}</PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t('Log Out')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default VerifyEmail;
