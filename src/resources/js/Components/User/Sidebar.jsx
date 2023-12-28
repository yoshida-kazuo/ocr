import React, { useEffect } from 'react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { UserIcon, DesktopComputerIcon } from "@heroicons/react/solid";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Sidebar({
    lang = '',
    timezone = ''
}) {
    const { t } = useTranslation();
    const sideMenus = [
        {
            "route": "dashboard",
            "label": t('Dashboard'),
            "icon": <DesktopComputerIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-400" />,
        },
        {
            "route": 'profile-edit',
            "label": t('Profile edit'),
            "icon": <UserIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-400" />,
        },
    ];

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <aside id="default-sidebar" className="fixed top-0 left-0 z-10 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="absolute top-0 h-28"></div>
            <div className="scrollbar relative top-28 max-h-[calc(100%-7rem)] pb-4 overflow-y-auto px-3 bg-white">
                <ul className="space-y-2 font-medium">
                    {sideMenus.map((menu, index) => (
                        <li key={index}>
                            <ResponsiveNavLink
                                href={route(menu.route)}
                                active={route().current(menu.route)}
                                className="flex items-center p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 group"
                            >
                                {menu.icon}
                                <span className="flex-1 ms-3 whitespace-nowrap">{menu.label}</span>
                            </ResponsiveNavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
