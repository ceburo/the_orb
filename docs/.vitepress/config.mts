import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "The Orb - Tutorial",
    description: "Create your first professional VS Code extension",
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'The Orb', link: '/mia-the-orb' },
            { text: 'Tutorial', link: '/01-introduction' }
        ],

        sidebar: [
            {
                text: 'The Orb',
                items: [
                    { text: 'Presentation', link: '/mia-the-orb' },
                ]
            },
            {
                text: 'Summary',
                items: [
                    { text: 'Introduction', link: '/01-introduction' },
                    { text: 'Sidebar Bar', link: '/02-sidebar-view' },
                    { text: 'Webview Provider', link: '/03-webview-provider' },
                    { text: 'Game Logic', link: '/04-game-logic' },
                    { text: 'Events', link: '/05-event-listeners' },
                    { text: 'Communication', link: '/06-webview-communication' },
                    { text: 'Persistence', link: '/07-persistence' },
                    { text: 'Deployment', link: '/08-deployment' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/ceburo/the_orb' }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2026 Nicolas Brouillet'
        }
    }
})
