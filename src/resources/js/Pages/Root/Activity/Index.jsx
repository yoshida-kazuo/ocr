import RootLayout from '@/Layouts/RootLayout';
import Pagination from '@/Components/Pagination';
import Sortable from '@/Components/Sortable';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Index({
    auth,
    lang,
    timezone
}) {
    const { t } = useTranslation();
    const { activities } = usePage().props;

    return (
        <RootLayout
            user={auth.user}
            header={<h2 className="mb-4 font-semibold text-xl leading-tight">{t('Activity')}</h2>}
            timezone={timezone}
            lang={lang}
        >
            <Head title={t('Activity')} />

            <div className="p-4 shadow sm:rounded-md">
                <div>
                    <table className="mb-6 table table-zebra">
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
        </RootLayout>
    );
}
