import { useState } from 'react';
import Navbar from '@/Components/User/Navbar';
import Sidebar from '@/Components/User/Sidebar';
import TimezoneSelector from '@/Components/TimezoneSelector';
import LangSelector from '@/Components/LangSelector';
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
            <Sidebar lang={lang} timezone={timezone} />

            <main className="absolute w-full mt-28 pl-64">
                <div className="w-auto">
                    <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                        {children}
                    </div>
                </div>

                <div className="px-12 w-72">
                    <div className="sm:max-w-md mt-6 px-6">
                        <LangSelector
                            defaultLang={lang}
                            className='form-select border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full'
                        />
                        <TimezoneSelector
                            defaultTimezone={timezone}
                            className='form-select border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full'
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
