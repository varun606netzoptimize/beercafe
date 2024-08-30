const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {
      boxShadow: {
        'custom': '2px 4px 6px rgba(0, 0, 0, 1)',
      },
      colors: {
        primary: '#F8C459',
        secondary: '#FFFFFF',
        baseColor: '#232323',
        textColor: '#FFFFFF',
        titleColor: '#1F1F1F',
        error: '#E57373',
        posPrimaryColor: '#ebbb40'
      },
      boxShadow: {
        itemsShadowCustom: '0 .125rem .5rem 0 rgba(47, 43, 61, .12)',
      },
      borderRadius: {
        posButtonRadius: '10px'
      }
    }
  }
}

export default config



