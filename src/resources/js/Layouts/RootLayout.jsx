import { useState } from 'react';
import Navbar from '@/Components/Root/Navbar';
import Sidebar from '@/Components/Root/Sidebar';
import { useTranslation } from 'react-i18next';

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
                    <div className="mx-auto sm:px-6 lg:px-8 space-y-6 mb-6">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}
