export const projects = [
  {
    id: 'campus-navigation',
    title: 'Campus Navigation System',
    subtitle: '3D-навигация по кампусу университета',
    description:
      'Дипломный проект: информационная система навигации по кампусу ЛГУ. 3D-визуализация зданий, поиск помещений и построение маршрутов внутри корпусов.',
    technologies: ['PHP', 'JavaScript', 'Three.js', 'PostgreSQL', 'Blender', 'WebGL'],
    github: 'https://github.com/Rockets826/3Dmodels',
    detailPage: './projects/campus-navigation/index.html',
    image: './assets/images/projects/campus-nav.svg',
    featured: true,
    type: 'diploma',
  },
  {
    id: 'gaming-news',
    title: 'Gaming News Website',
    subtitle: 'Новостной портал об играх',
    description:
      'Веб-платформа для публикации игровых новостей с категориями, поиском и адаптивным интерфейсом. Backend на PHP, данные в PostgreSQL.',
    technologies: ['PHP', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    github: 'https://github.com/Rockets826',
    detailPage: './projects/gaming-news/index.html',
    image: './assets/images/projects/gaming-news.svg',
    featured: false,
    type: 'web',
  },
  {
    id: 'telegram-automation',
    title: 'Telegram Automation',
    subtitle: 'Автоматизация рабочих процессов',
    description:
      'Telegram-бот для автоматизации уведомлений и рутинных операций. Интеграция с рабочими процессами, снижение ручного труда.',
    technologies: ['PHP', 'Telegram Bot API', 'SQL', 'JavaScript'],
    github: 'https://github.com/Rockets826',
    detailPage: './projects/telegram-automation/index.html',
    image: './assets/images/projects/telegram-automation.svg',
    featured: false,
    type: 'automation',
  },
];
