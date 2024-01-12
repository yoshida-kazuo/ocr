import { createRoot } from 'react-dom/client';
import { createInertiaApp, InertiaAppProps } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import './bootstrap';
import '../css/app.scss';
import.meta.glob([
    '../images/**',
    '../fonts/**',
]);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title: string) => `${title} - ${appName}`,
    resolve: (name: string) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }: InertiaAppProps) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: false,
});
