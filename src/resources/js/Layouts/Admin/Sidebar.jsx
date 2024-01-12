import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { DesktopComputerIcon, EyeIcon, UsersIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const sideMenus = [
        {
            "route": "admin.dashboard",
            "label": t('Dashboard'),
            "icon": <DesktopComputerIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />,
        },
        {
            "route": "admin.user.manager",
            "label": t('User management'),
            "icon": <UsersIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
        },
        {
            "route": "admin.activity",
            "label": t('Activity'),
            "icon": <EyeIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
        },
    ];

    return (
        <aside id="default-sidebar" className="drawer-side z-20 text-gray-800 sm:z-0">
            <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="absolute top-0 h-28 w-64 bg-white">
                <Link href={route('admin.dashboard')} className="sm:hidden justify-center flex flex-col h-28">
                    <ApplicationLogo className="block h-16 w-auto fill-current text-gray-500" />
                </Link>
            </div>
            <div className="scrollbar relative top-28 w-64 h-screen max-h-[calc(100%-7rem)] pb-4 overflow-y-auto px-3 bg-white">
                <ul className="menu px-0 py-0">
                    {sideMenus.map((menu, index) => (
                        <li key={index}>
                            <Link
                                href={route(menu.route)}
                                className={'py-3 ' + (route().current(menu.route) && 'active text-white' || '')}
                            >
                                {menu.icon}
                                <span>{menu.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
