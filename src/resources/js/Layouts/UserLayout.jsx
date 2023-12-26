import { useState } from 'react';
import Navbar from '@/Components/User/Navbar';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import TimezoneSelector from '@/Components/TimezoneSelector';
import LangSelector from '@/Components/LangSelector';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function User({
    user,
    header,
    children,
    lang,
    timezone
}) {
    const { t } = useTranslation();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <>
            <Navbar lang={lang} timezone={timezone} />

            <main className="absolute w-full">
                <div className="mt-28">
                    {children}
                </div>

                <div className="px-12 w-72">
                    <div className="sm:max-w-md mt-6 px-6">
                        <TimezoneSelector
                            defaultTimezone={timezone}
                            className='form-select border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full'
                        />
                        <LangSelector
                            defaultLang={lang}
                            className='form-select border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full'
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
