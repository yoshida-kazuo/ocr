import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { UserIcon, DesktopComputerIcon } from "@heroicons/react/solid";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Sidebar({
    lang,
    timezone
}) {
    const { t } = useTranslation();
    const sideMenus = [
        {
            "route": "root.dashboard",
            "label": t('Dashboard'),
            "icon": <DesktopComputerIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />,
        },
        {
            "route": 'root.profile.edit',
            "label": t('Profile edit'),
            "icon": <UserIcon className="flex-shrink-0 w-5 h-5 transition duration-75" />,
        },
    ];

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <aside id="default-sidebar" className="fixed top-0 left-0 z-10 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
            <div className="absolute top-0 h-28"></div>
            <div className="scrollbar relative top-28 max-h-[calc(100%-7rem)] pb-4 overflow-y-auto px-3 bg-white">
                <ul className="menu px-0 py-0">
                    {sideMenus.map((menu, index) => (
                        <li key={index}>
                            <Link
                                href={route(menu.route)}
                                className={'py-3 ' + (route().current(menu.route) && 'active text-white' || '')}
                            >
                                {menu.icon}
                                <span className="">{menu.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
