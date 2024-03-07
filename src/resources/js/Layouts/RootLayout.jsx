import Navbar from '@/Layouts/Root/Navbar';
import Sidebar from '@/Layouts/Root/Sidebar';

export default function User({
    user,
    header,
    children,
    lang,
    timezone
}) {
    return (
        <div className="drawer sm:drawer-open">
            <input id="root-drawer" type="checkbox" className="drawer-toggle" />
            <Sidebar
                lang={lang}
                timezone={timezone}
                user={user}
                header={header}
            />

            <main className="drawer-content absolute w-full sm:max-w-[calc(100%-16em)] sm:left-64 transition-transform overflow-hidden">
                <Navbar
                    lang={lang}
                    timezone={timezone}
                    user={user}
                    header={header}
                />
                <div className="w-auto p-4">
                    {header}

                    <div className="mx-auto mb-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
