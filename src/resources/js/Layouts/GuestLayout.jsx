import Navbar from '@/Layouts/Guest/Navbar';
import Sidebar from '@/Layouts/Guest/Sidebar';

export default function Guest({
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
            <input id="guest-drawer" type="checkbox" className="drawer-toggle" />

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

            <main className="drawer-content absolute w-full max-w-full mt-24 transition-transform">
                <div className="w-auto">
                    <div className="mx-auto mb-6 sm:mr-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
