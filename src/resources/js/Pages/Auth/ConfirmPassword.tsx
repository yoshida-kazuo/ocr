import React, { FormEvent, useEffect } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { AuthConfirmPasswordProps } from '@/Interfaces/Pages';

const ConfirmPassword: React.FC<AuthConfirmPasswordProps> = ({
    lang,
    timezone
}) => {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <AuthLayout timezone={timezone} lang={lang}>
            <Head title={t('Confirm Password')} />

            <div className="mb-4 text-sm text-gray-600">
                {t('This is a secure area of the application. Please confirm your password before continuing.')}
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e:any) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        {t('Confirm')}
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ConfirmPassword;