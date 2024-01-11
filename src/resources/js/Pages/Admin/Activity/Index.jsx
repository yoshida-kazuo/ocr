import { useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import Sortable from '@/Components/Sortable';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Index({
    auth,
    lang,
    timezone
}) {
    const { t } = useTranslation();
    const { activities } = usePage().props;

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="mb-6 font-semibold text-xl text-gray-800 leading-tight">{t('Activity')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Activity')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-md">
                <div className="p-6 text-gray-900">
                    <table className="mb-12 table table-zebra">
                        <thead>
                            <tr>
                                <th></th>
                                <th>
                                    <Sortable
                                        title={t('Registration datetime')}
                                        column="created_at"
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Type')}
                                        column="type"
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('User')}
                                        column="user_id"
                                    />
                                </th>
                                <th>
                                    <Sortable
                                        title={t('Message')}
                                        column="message"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {activities.data.map(activity => (
                            <tr key={activity.id}>
                                <th>{activity.id}</th>
                                <td>{activity.created_at}</td>
                                <td>{activity.type}</td>
                                <td>{activity?.user?.name}</td>
                                <td>{activity.message}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <Pagination items={activities} />
                </div>
            </div>
        </AdminLayout>
    );
}
