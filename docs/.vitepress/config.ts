import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@beerush/utils',
  description: 'A TypeScript utilities library for internal and external use',
  
  base: '/utils/',
  
  // Ignore dead links for now since we're just setting up the structure
  ignoreDeadLinks: true,
  
  // GitHub Pages specific settings
  outDir: '.vitepress/dist',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' }
    ],
    
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'API',
        items: [
          { text: 'Client', link: '/api/client/' },
          { 
            text: 'Global', 
            link: '/api/global/',
            items: [
              { text: 'Color', link: '/api/global/color' },
              { text: 'Helper', link: '/api/global/helper' },
              { text: 'Inspector', link: '/api/global/inspector' },
              { text: 'Logger', link: '/api/global/logger' },
              { text: 'Number', link: '/api/global/number' },
              { text: 'Object', link: '/api/global/object' },
              { text: 'String', link: '/api/global/string' },
              { text: 'Timeout', link: '/api/global/timeout' }
            ]
          },
          { text: 'Server', link: '/api/server/' }
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/beerush-id/utils' }
    ]
  }
})