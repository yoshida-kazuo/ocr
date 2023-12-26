import Navbar from '@/Components/Guest/Navbar';

export default function Guest({
    children,
    lang,
    timezone
}) {
    return (
        <>
            <Navbar lang={lang} timezone={timezone} />

            {children}
        </>
    );
}
