import { useEffect } from 'react';
import RootLayout from '@/Layouts/RootLayout';
import Pagination from '@/Components/Pagination';
import Sortable from '@/Components/Sortable';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Index({
    auth,
    lang,
    timezone,
    users
}) {
    const { t } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <RootLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('User management')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('User management')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-md">
                <div className="p-6 text-gray-900">
                    <table className="mb-12 table table-zebra">
                        <thead>
                            <tr>
                                <th></th>
                                <th>
                                    <Sortable
                                        title={t('Role')}
                                        column="role_id"
                                        className=""
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Name')}
                                        column="name"
                                        className=""
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Email')}
                                        column="email"
                                        className=""
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Last Update')}
                                        column="updated_at"
                                        className=""
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {users?.data?.map(user => (
                            <tr key={user.id}>
                                <th>{user.id}</th>
                                <td>{user.role_id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.updated_at}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <Pagination items={users} />
                </div>
            </div>
        </RootLayout>
    );
}
