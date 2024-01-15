import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const sideMenus = [
        {
            "route": "home",
            "label": t('Home Page'),
        },
        {
            "route": "contact",
            "label": t('Contact'),
        }
    ];

    return (
        <aside id="default-sidebar" className="drawer-side z-20 sm:z-0 sm:hidden">
            <label htmlFor="guest-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="absolute bg-base-200 top-0 h-28 w-64">
                <Link href={route('home')} className="sm:hidden justify-center flex flex-col h-28">
                    <ApplicationLogo className="block h-16 w-auto fill-current" />
                </Link>
            </div>
            <div className="scrollbar bg-base-200 relative top-28 w-64 h-lvh max-h-[calc(100vh-7rem)] pb-4 overflow-y-auto px-3">
                <ul className="menu bg-base-200 px-0 py-0">
                    {sideMenus.map((menu, index) => (
                        <li key={index}>
                            <Link
                                href={route(menu.route)}
                                className={'py-3 ' + (route().current(menu.route) && 'active' || '')}
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
