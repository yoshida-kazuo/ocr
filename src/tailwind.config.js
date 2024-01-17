import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
        fontFamily: {
            sans: [
                '"Montserrat", sans-serif'
            ]
        },
        extend: {
            fontFamily: {
                sans: [
                    '"Montserrat", sans-serif',
                    'Figtree',
                    ...defaultTheme.fontFamily.sans
                ],
            },
        },
    },

    plugins: [
        require("@tailwindcss/typography"),
        require("daisyui"),
    ],

    daisyui: {
        themes: [
            "light",
            "dark",
            "wireframe",
            "fantasy",
            "dracula",
            "garden",
            "business"
        ],
        darkTheme: "white",
        base: true,
        styled: true,
        utils: true,
        prefix: "",
        logs: true,
        themsRoot: ":root",
    }
};
