import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import LangSelector from '@/Components/LangSelector';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Navbar({
    user,
    lang
}) {
    const { t } = useTranslation();

    return (
        <header className="absolute w-full z-20">
            <nav className="mt-0 mb-0 mx-auto w-full sm:w-9/12 bg-white relative">
                <div className="navbar text-gray-500">
                    <div className="flex">
                        <Link href={route('home')} className="mx-6 hidden sm:block">
                            <ApplicationLogo className="block h-9 w-auto fill-current" />
                        </Link>
                        <label htmlFor="guest-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost sm:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>

                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink href={route('home')} active={route().current('home')}>
                                {t('Home Page')}
                            </NavLink>
                            <NavLink href={route('contact')} active={route().current('contact')}>
                                {t('Contact')}
                            </NavLink>
                        </div>
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
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="-mt-2 mb-0 mx-auto w-full sm:w-9/12"><svg viewBox="0 0 1140 34" fill="none"><g opacity=".6" filter="url(#:R5l6:-a)"><path fill="url(#:R5l6:-b)" d="M6 6h1128v22H6z"></path><path fill="url(#:R5l6:-c)" d="M6 6h1128v22H6z"></path></g><defs><radialGradient id=":R5l6:-c" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -22 1128 0 563 28)"><stop offset=".273" stopColor="#fff"></stop><stop offset="1" stopColor="#fff" stopOpacity="0"></stop></radialGradient><linearGradient id=":R5l6:-b" x1="6" y1="6" x2="1134" y2="6" gradientUnits="userSpaceOnUse"><stop stopColor="#A78BFA" stopOpacity="0"></stop><stop offset=".323" stopColor="#A78BFA"></stop><stop offset=".672" stopColor="#EC4899" stopOpacity=".3"></stop><stop offset="1" stopColor="#EC4899" stopOpacity="0"></stop></linearGradient><filter id=":R5l6:-a" x="0" y="0" width="1140" height="34" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="3" result="effect1_foregroundBlur_311_43535"></feGaussianBlur></filter></defs></svg></div>
        </header>
    );
}
