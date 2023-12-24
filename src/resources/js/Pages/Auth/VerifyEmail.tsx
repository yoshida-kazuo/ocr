import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function VerifyEmail({ status, lang, timezone }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout timezone={timezone} lang={lang}>
            <Head title={t('Email Verification')} />

            <div className="mb-4 text-sm text-gray-600">
                {t(`Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.`)}
            </div>

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
        </GuestLayout>
    );
}
