import Game from '@/components/pages/Game';

export const routes = {
  game: {
    id: 'game',
    label: 'Game',
    path: '/game',
    icon: 'Play',
    component: Game
  }
};

export const routeArray = Object.values(routes);
export default routes;