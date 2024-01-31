import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Sidebar({
    menus
}) {
    const { t } = useTranslation();

    return (
        <div className="drawer-side z-30 sm:z-0">
            <label htmlFor="auth-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <aside id="default-sidebar" className="fixed">
                <div className="absolute bg-base-200 bg-opacity-70 backdrop-blur top-0 h-28 w-64">
                    <Link href={route('home')} className="sm:hidden justify-center flex flex-col h-28">
                        <ApplicationLogo className="block h-16 w-auto fill-current" />
                    </Link>
                </div>
                <div className="scrollbar bg-base-200 bg-opacity-70 backdrop-blur relative top-28 w-64 h-lvh max-h-[calc(100vh-7rem)] pb-4 overflow-y-auto px-3">
                    <ul className="menu px-0 py-0">
                        {menus.map((menu, index) => (
                            <li key={index}>
                                <Link
                                    href={route(menu.route)}
                                    className={'py-3 ' + (route().current(menu.route) && 'active' || '')}
                                >
                                    {menu.icon}
                                    <span>{t(menu.label)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
