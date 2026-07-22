export const projects = [
  {
    id: 'campus-navigation',
    title: 'Campus Navigation System',
    subtitle: '3D-навигация по кампусу университета',
    description:
      'Информационная система навигации по кампусу ЛГУ. Включает 3D-визуализацию зданий, поиск помещений, построение маршрутов внутри корпусов и интерактивную карту района.',
    features: [
      '3D-модели зданий (Blender → GLB)',
      'WebGL-сцена на Three.js',
      'Поиск помещений и маршрутизация',
      'PostgreSQL для хранения данных',
    ],
    technologies: ['PHP', 'JavaScript', 'Three.js', 'PostgreSQL', 'Blender'],
    github: 'https://github.com/Rockets826/3Dmodels',
    detailPage: './projects/campus-navigation/index.html',
    image: './assets/images/projects/campus-nav.svg',
    featured: true,
  },
];
