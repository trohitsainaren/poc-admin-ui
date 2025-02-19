/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';


const themeDark = {
  50: '#0a0a0a',
  100: '#111111',
  200: '#1c1c1c',
};

const themeLight = {
  50: '#fcfcf9',
  100: '#f3f3ee',
  200: '#e8e8e3',
};

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderColor: {
        light: themeLight,
        dark: themeDark,
      },
      colors: {
        dark: {
          primary: themeDark[50],
          secondary: themeDark[100],
          ...themeDark,
        },
        light: {
          primary: themeLight[50],
          secondary: themeLight[100],
          ...themeLight,
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
