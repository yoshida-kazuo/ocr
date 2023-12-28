import React, { useEffect, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '../ResponsiveNavLink';
import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';
import { UserCircleIcon } from "@heroicons/react/solid";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Navbar({
    lang = '',
    timezone = ''
}) {
    const { t } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <header className="absolute w-full z-20">
            <nav className="mt-3 mb-0 mx-auto w-9/12 bg-white rounded-lg shadow-md relative">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href={route('dashboard')} className="mx-6">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-500" />
                            </Link>
                        </div>

                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink href={route('login')} active={route().current('login')}>
                                {t('Log in')}
                            </NavLink>
                            <NavLink href={route('register')} active={route().current('register')}>
                                {t('Register')}
                            </NavLink>
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <div className="ml-3 relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            <UserCircleIcon className="w-7" />
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('login')}>{t('Log in')}</Dropdown.Link>
                                    <Dropdown.Link href={route('register')}>{t('Register')}</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="-mt-2 mb-4 mx-auto w-9/12">
            <svg viewBox="0 0 1140 34" fill="none">
                    <g opacity=".6" filter="url(#:R5l6:-a)"><path fill="url(#:R5l6:-b)" d="M6 6h1128v22H6z"></path><path fill="url(#:R5l6:-c)" d="M6 6h1128v22H6z"></path></g><defs><radialGradient id=":R5l6:-c" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -22 1128 0 563 28)"><stop offset=".273" stopColor="#fff"></stop><stop offset="1" stopColor="#fff" stopOpacity="0"></stop></radialGradient><linearGradient id=":R5l6:-b" x1="6" y1="6" x2="1134" y2="6" gradientUnits="userSpaceOnUse"><stop stopColor="#A78BFA" stopOpacity="0"></stop><stop offset=".323" stopColor="#A78BFA"></stop><stop offset=".672" stopColor="#EC4899" stopOpacity=".3"></stop><stop offset="1" stopColor="#EC4899" stopOpacity="0"></stop></linearGradient><filter id=":R5l6:-a" x="0" y="0" width="1140" height="34" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="3" result="effect1_foregroundBlur_311_43535"></feGaussianBlur></filter></defs>
                </svg>
            </div>
        </header>
    );
}
