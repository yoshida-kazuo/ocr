import Navbar from '@/Components/Guest/Navbar';

export default function Guest({
    user,
    header,
    children,
    lang,
    timezone
}) {
    return (
        <>
            <Navbar lang={lang} timezone={timezone} user={user} header={header} />

            <main className="absolute w-full max-w-full mt-28 transition-transform">
                <div className="w-auto">
                    <div className="mx-auto sm:px-6 lg:px-8 space-y-6 mb-6">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}
