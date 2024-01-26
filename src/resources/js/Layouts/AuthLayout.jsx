import Navbar from '@/Layouts/Auth/Navbar';
import Sidebar from '@/Layouts/Auth/Sidebar';

export default function Auth({
    user,
    header,
    children,
    lang,
    timezone
}) {
    const menus = [
        {
            "route": "home",
            "label": 'Home Page',
        },
        {
            "route": "contact",
            "label": 'Contact',
        }
    ];

    return (
        <div className="drawer">
            <input id="auth-drawer" type="checkbox" className="drawer-toggle" />
            <Navbar
                lang={lang}
                timezone={timezone}
                user={user}
                header={header}
                menus={menus}
            />
            <Sidebar
                lang={lang}
                timezone={timezone}
                user={user}
                header={header}
                menus={menus}
            />

            <div className="drawer-content min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
                <div className="w-full sm:max-w-md mt-20 sm:mt-6 px-6 py-4 shadow-md overflow-hidden sm:rounded-md mb-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
