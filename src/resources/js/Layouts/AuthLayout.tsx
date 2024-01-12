import React from 'react';
import Navbar from '@/Layouts/Auth/Navbar';
import Sidebar from '@/Layouts/Auth/Sidebar';
import { UserProps } from '@/Interfaces/Layouts';

const AuthLayout: React.FC<UserProps> = ({
    user,
    header,
    children,
    lang,
    timezone
}) => {
    return (
        <div className="drawer">
            <input id="auth-drawer" type="checkbox" className="drawer-toggle" />
            <Navbar lang={lang} timezone={timezone} user={user} header={header} />
            <Sidebar lang={lang} timezone={timezone} user={user} header={header} />

            <div className="drawer-content min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-white">
                <div className="w-full sm:max-w-md mt-24 sm:mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-md mb-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
