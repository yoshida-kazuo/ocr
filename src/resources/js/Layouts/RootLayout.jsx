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
            <Navbar lang={lang} timezone={timezone} user={user} header={header} />
            <Sidebar lang={lang} timezone={timezone} user={user} header={header} />

            <main className="drawer-content absolute w-full max-w-full mt-24 transition-transform">
                <div className="w-auto">
                    {header}

                    <div className="mx-auto mb-6 sm:mr-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
