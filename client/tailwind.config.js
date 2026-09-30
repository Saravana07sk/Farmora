/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // The Fertile Ground Palette
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7', // Primary (60%): Soft Cream
          200: '#FAF6EE',
          300: '#F4ECE0',
          400: '#EBDDCB',
          500: '#DEC9AF',
          DEFAULT: '#FDFBF7',
        },
        forest: {
          50: '#F2F7F3',
          100: '#E0EDE2',
          200: '#BFDAC3',
          300: '#94C09B',
          400: '#5F9E6B',
          500: '#3D7E4B',
          600: '#2A5C34',
          700: '#1E3F20', // Secondary (30%): Deep Forest
          800: '#152C16',
          900: '#0C1B0D',
          DEFAULT: '#1E3F20',
        },
        soil: {
          50: '#FAF6F4',
          100: '#F3ECE7',
          200: '#E3D4CB',
          300: '#CDB4A6',
          400: '#AD8B77',
          500: '#84624F',
          600: '#634535',
          700: '#4E3629', // Supporting: Fertile Soil
          800: '#3A271C',
          900: '#261912',
          DEFAULT: '#4E3629',
        },
        leaf: {
          50: '#F5FAE9',
          100: '#E8F5D0',
          200: '#D2ECA6',
          300: '#B6DF73',
          400: '#95CB41',
          500: '#74A12E', // Accent (10%): Fresh Leaf
          600: '#5C8223',
          700: '#456218',
          800: '#30450F',
          900: '#1D2A08',
          DEFAULT: '#74A12E',
        },
        // Backwards compatibility mappings for older theme classes
        agri: {
          cream: '#FDFBF7',
          forest: '#1E3F20',
          soil: '#4E3629',
          leaf: '#74A12E',
          dark: '#1E3F20',
          primary: '#1E3F20',
          light: '#74A12E',
          accent: '#74A12E',
          mint: '#E8F5D0',
          yellow: '#74A12E',
        },
      },
    },
  },
  plugins: [],
};
