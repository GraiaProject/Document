const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

module.exports = {
  title: 'Broadcast Control Docs',
  tagline: 'The Docs for Broadcast Control',
  url: 'https://autumn-elaina.vercel.app/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'GraiaProject', // Usually your GitHub org/user name.
  projectName: 'BroadcastControl', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Broadcast Control',
      items: [
        {
          to: 'docs/broadcast/basic/hello-world',
          activeBasePath: 'docs',
          label: '文档',
          position: 'left',
        },
        {
          href: 'https://github.com/GreyElaina/Document',
          label: 'Repo on GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '相关项目',
          items: [
            {
              label: 'Avilla',
              href: 'https://github.com/GraiaProject/Avilla'
            },
            {
              label: 'Broadcast Control',
              href: 'https://github.com/GraiaProject/BroadcastControl'
            },
            {
              label: 'Graia Application for Mirai',
              href: 'https://github.com/GraiaProject/Application'
            }
          ]
        },
        {
          title: '社区 - Community',
          items: [
            {
              label: 'QQ Group',
              href: 'https://jq.qq.com/?_wv=1027&k=VXp6plBD',
            },
            {
              label: 'Github Organization',
              href: 'https://github.com/GraiaProject',
            }
          ],
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Graia Project. 由 Docusaurus Ⅱ 强力驱动.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/GraiaProject/Document/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
