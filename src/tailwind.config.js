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
            "dark",
            {
                lofi: {
                    ...require("daisyui/src/theming/themes")["lofi"],
                    "info": "#bae6fd",
                    "success": "#bbf7d0",
                    "warning": "#fef9c3",
                    "--rounded-box": ".3rem",
                    "--rounded-btn": ".3rem",
                    "--rounded-badge": ".3rem",
                    "--tab-radius": ".3rem"
                }
            }
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
