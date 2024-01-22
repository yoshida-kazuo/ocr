import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { DesktopComputerIcon, EyeIcon, UsersIcon } from "@heroicons/react/solid";
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const sideMenus = [
        {
            "route": "root.dashboard",
            "label": t('Dashboard'),
            "icon": <DesktopComputerIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />,
        },
        {
            "route": "root.user.manager",
            "label": t('User management'),
            "icon": <UsersIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
        },
        {
            "route": "root.activity",
            "label": t('Activity'),
            "icon": <EyeIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />
        },
    ];

    return (
        <div className="drawer-side z-20 sm:z-0">
            <label htmlFor="root-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <aside id="default-sidebar" className="fixed">
                <div className="absolute bg-base-200 bg-opacity-70 backdrop-blur top-0 h-28 w-64">
                    <Link href={route('root.dashboard')} className="sm:hidden justify-center flex flex-col h-28">
                        <ApplicationLogo className="block h-16 w-auto fill-current" />
                    </Link>
                </div>
                <div className="scrollbar bg-base-200 bg-opacity-70 backdrop-blur relative top-28 w-64 h-lvh max-h-[calc(100vh-7rem)] pb-4 overflow-y-auto px-3">
                    <ul className="menu px-0 py-0">
                        {sideMenus.map((menu, index) => (
                            <li key={index}>
                                <Link
                                    href={route(menu.route)}
                                    className={'py-3 ' + (route().current(menu.route) && 'active' || '')}
                                >
                                    {menu.icon}
                                    <span>{menu.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
