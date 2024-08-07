import type { Config } from 'tailwindcss'
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'light-green': '#e2f0e8',
        'dark-green': '#005447',
        'peach': '#e69e81',
        'green-text': '#003b31',
        'off-white': '#fffbfa',
        'border-color': '#ccd5d2'
      },
      fontFamily: {
        sans: ['var(--font-outfit)'],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}
export default config
