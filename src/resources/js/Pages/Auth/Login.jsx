import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import AuthLayout from '@/Layouts/AuthLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Login({
    status,
    canResetPassword,
    googleAuth,
    xAuth,
    twitchAuth,
    lang,
    timezone,
    errors
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <AuthLayout timezone={timezone} lang={lang}>
            <Head title={t('Log in')} />

            {status && <div className="mb-4 font-medium text-sm">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value={t('Login ID')} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={t('Email')}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-2">
                    <InputLabel htmlFor="password" value={t('Password')} />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm">{t('Remember me')}</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-2">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('Forgot your password?')}
                        </Link>
                    )}
                </div>

                <div className="mt-2">
                    <div>
                        <PrimaryButton className="w-full" disabled={processing}>
                            {t('Log in')}
                        </PrimaryButton>
                    </div>

                    {xAuth && (
                        <div className="mt-2">
                            <a
                                href={route('auth.x')}
                                className="btn w-full"
                            >
                                <img className="h-6 w-6" src="https://ton.twimg.com/app_icons/oauth_application.png" />
                                {t('Sign in with X')}
                            </a>
                            <InputError message={errors.x_auth} className="mt-2" />
                        </div>
                    )}

                    {googleAuth && (
                        <div className="mt-2">
                            <a
                                href={route('auth.google')}
                                className="btn w-full"
                            >
                                <svg className="h-6 w-6" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                    <path fill="none" d="M0 0h48v48H0z" />
                                </svg>
                                {t('Sign in with Google')}
                            </a>
                            <InputError message={errors.google_auth} className="mt-2" />
                        </div>
                    )}

                    {twitchAuth && (
                        <div className="mt-2">
                            <a
                                href={route('auth.twitch')}
                                className="btn w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0H3.857zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142v6.286z"/>
                                    <path d="M11.857 3.143h-1.143V6.57h1.143V3.143zm-3.143 0H7.571V6.57h1.143V3.143z"/>
                                </svg>
                                {t('Sign in with Twitch')}
                            </a>
                            <InputError message={errors.twitch_auth} className="mt-2" />
                        </div>
                    )}
                </div>
            </form>

            <div className="flex items-center justify-end mt-2">
                <Link
                    href={route('register')}
                    className="underline text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {t('Register Here for New Account')}
                </Link>
            </div>
            <InputError message={errors.registration} className="mt-2" />
        </AuthLayout>
    );
}
