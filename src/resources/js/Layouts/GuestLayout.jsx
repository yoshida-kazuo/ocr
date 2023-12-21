import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import TimezoneSelector from '@/Components/TimezoneSelector';
import LangSelector from '@/Components/LangSelector';

export default function Guest({ children, lang, timezone }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4">
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
    );
}
