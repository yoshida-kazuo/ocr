import React, { useState } from "react";

export default function Navbar({
    active = false,
    className = '',
    children,
    ...props
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        { href: "#home", label: "ホーム" }
    ];

    return (
        <>
            <header className="sm:px-8 px-4 py-2 z-10 w-full">
                <nav className="flex justify-between items-center max-container">
                    <a href="/" className="text-3xl font-bold">Logo</a>
                    <ul className="flex-1 flex justify-center items-center gap-16 max-lg:hidden">
                        {navLinks.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="font-monterrat leading-normal text-lg text-slate-gray"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
        </>
    );
}
