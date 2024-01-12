import RootLayout from '@/Layouts/RootLayout';
import Pagination from '@/Components/Pagination';
import Sortable from '@/Components/Sortable';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Index({
    auth,
    lang,
    timezone,
    users
}) {
    const { t } = useTranslation();

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
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Name')}
                                        column="name"
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Email')}
                                        column="email"
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Last Updated')}
                                        column="updated_at"
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Deleted At')}
                                        column="deleted_at"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {users?.data?.map(user => (
                            <tr key={user.id}>
                                <th>{user.id}</th>
                                <td>{user.role.role}</td>
                                <td>
                                    <Link
                                        href={route('root.user.manager.edit', { id: user.id })}
                                    >{user.name}</Link>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.updated_at}</td>
                                <td>{user.deleted_at}</td>
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
