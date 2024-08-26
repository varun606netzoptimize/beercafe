const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {
      colors: {
        primary: '#F8C459',
        secondary: '#FFFFFF',
        baseColor: '#232323',
        textColor: '#FFFFFF',
        titleColor: '#1F1F1F',
        error: '#E57373'
      },
      boxShadow: {
        itemsShadowCustom: '0 .125rem .5rem 0 rgba(47, 43, 61, .12)',
      },
    }
  }
}

export default config



