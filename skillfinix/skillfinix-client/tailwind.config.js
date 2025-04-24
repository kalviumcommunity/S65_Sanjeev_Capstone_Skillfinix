/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      theme: {
        extend: {
          screens: {
            'xs': '475px', // Custom breakpoint for extra small screens
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
          },
          aspectRatio: {
            'video': '16 / 9',
          },
          height: {
            'screen-80': '80vh',
          },
          maxHeight: {
            'screen-80': '80vh',
          }
        },
      },
    },
  },
  plugins: [],
}

