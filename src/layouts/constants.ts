import type { NavItem } from '@/layouts/types';

export const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/weather', label: 'Weather', icon: '🌤️' },
  { path: '/news', label: 'News', icon: '📰' },
  {
    path: '/games',
    label: 'Games',
    icon: '🎮',
    nested: [
      { path: '/games/tictactoe', label: 'Tic Tac Toe', icon: '⭕' },
      { path: '/games/snake', label: 'Snake Game', icon: '🐍' },
    ],
  },
  { path: '/food', label: 'Food', icon: '🍔' },
];

