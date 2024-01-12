import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { HomeProps } from '@/Interfaces/Pages';

const Home: React.FC<HomeProps> = ({
    auth,
    lang
}) => {
    const { t } = useTranslation();

    return (
        <GuestLayout user={auth.user} header={t('Home Page')} lang={lang}>
            <Head title={t('Home Page')} />

            <div>
                <div className="p-6 text-gray-900">{t('Home Page')}</div>
            </div>
        </GuestLayout>
    );
};

export default Home;
