import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import Sortable from '@/Components/Sortable';
import { Head, Link } from '@inertiajs/react';
import { UserAddIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

export default function Index({
    auth,
    lang,
    timezone,
    users
}) {
    const { t } = useTranslation();

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('User management')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('User management')} />

            <div className="p-4 shadow sm:rounded-md">
                <div>
                    <Link
                        href={route('admin.user.manager.create')}
                        className="inline-block"
                    >
                        <UserAddIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
                    </Link>

                    <table className="mb-6 table table-zebra">
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
                                        href={route('admin.user.manager.edit', { id: user.id })}
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
        </AdminLayout>
    );
}

