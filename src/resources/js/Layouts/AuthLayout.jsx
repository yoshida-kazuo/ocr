import Navbar from '@/Components/Auth/Navbar';

export default function Auth({ children, lang, timezone }) {
    return (
        <>
            <Navbar lang={lang} timezone={timezone} />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-white">
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-md mb-6">
                    {children}
                </div>
            </div>
        </>
    );
}
