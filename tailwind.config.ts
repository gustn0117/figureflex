import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E8930C',
        'primary-dark': '#D17E00',
        secondary: '#1a1a2e',
        accent: '#F5A623',
        highlight: '#e94560',
        surface: '#FFFBF5',
      },
    },
  },
  plugins: [],
}
export default config
