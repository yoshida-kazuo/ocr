import React, { useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Sidebar({
    lang,
    timezone
}) {
    const { t } = useTranslation();
    const sideMenus = [
        {
            "route": "top",
            "label": t('Top page'),
        },
        {
            "route": "contact",
            "label": t('Contact'),
        }
    ];

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <aside id="default-sidebar" className="drawer-side z-20 sm:z-0 sm:hidden">
            <label htmlFor="guest-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="absolute top-0 h-28 w-64 bg-white">
                <Link href={route('top')} className="sm:hidden justify-center flex flex-col h-28">
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
                                <span className="">{menu.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
