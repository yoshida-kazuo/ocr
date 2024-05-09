import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import LangSelector from '@/Components/LangSelector';
import TimezoneSelector from '@/Components/TimezoneSelector';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Navbar({
    user,
    lang,
    timezone,
    menus
}) {
    const { t } = useTranslation();

    return (
        <header className="bg-base-200 sticky drawer-content top-0 w-full z-20 h-16 bg-opacity-70 backdrop-blur">
            <nav className="mt-0 mb-0 mx-auto w-full sm:w-[66rem] relative">
                <div className="navbar">
                    <div className="flex">
                        <Link href={route('home')} className="mx-6 hidden sm:block">
                            <ApplicationLogo className="block h-9 w-auto fill-current" />
                        </Link>
                        <label htmlFor="guest-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost sm:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>

                        {menus && (
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {menus.map((menu, index) => (
                                    <NavLink
                                        key={index}
                                        href={route(menu.route)}
                                        active={route().current(menu.route)}
                                    >
                                        {t(menu.label)}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end flex-1 px-2">
                        <div className="flex items-stretch my-auto">
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                                </div>
                                <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                                    {user ? (
                                        <li>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >{t('Log out')}</Link>
                                        </li>
                                    ) : (
                                        <li>
                                            <Link
                                                href={route('login')}
                                                as="button"
                                            >{t('Log in')}</Link>
                                        </li>
                                    )}
                                    <li>
                                        <LangSelector
                                            defaultLang={lang}
                                        />
                                    </li>
                                    <li>
                                        <TimezoneSelector
                                            defaultTimezone={timezone}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
