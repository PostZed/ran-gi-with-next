import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        keyframes: {
            changeColor: {
                '100%': {
                   transform: 'translateX(100%)'
                },
            },
        },
    },
   // plugins: [require('@tailwindcss/forms')],
};
export default config;
