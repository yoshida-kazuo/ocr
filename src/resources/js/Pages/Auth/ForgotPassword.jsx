import AuthLayout from '@/Layouts/AuthLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword({
    status,
    lang,
    timezone
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout timezone={timezone} lang={lang}>
            <Head title={t('Forgot Password')} />

            <div className="mb-2 text-sm">
                {t('Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.')}
            </div>

            {status && <div className="mb-2 font-medium text-sm">{status}</div>}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton disabled={processing}>
                        {t('Email Password Reset Link')}
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
}
