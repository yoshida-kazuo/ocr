import React from 'react';
import Navbar from '@/Layouts/Guest/Navbar';
import Sidebar from '@/Layouts/Guest/Sidebar';
import { UserProps } from '@/Interfaces/Layouts';

const GuestLayout: React.FC<UserProps> = ({
    user,
    header,
    children,
    lang,
    timezone
}) => {
    return (
        <div className="drawer">
            <input id="guest-drawer" type="checkbox" className="drawer-toggle" />
            <Navbar lang={lang} timezone={timezone} user={user} header={header} />
            <Sidebar lang={lang} timezone={timezone} user={user} header={header} />

            <main className="drawer-content absolute w-full max-w-full mt-24 transition-transform">
                <div className="w-auto">
                    <div className="mx-auto sm:px-6 lg:px-8 space-y-6 mb-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GuestLayout;
