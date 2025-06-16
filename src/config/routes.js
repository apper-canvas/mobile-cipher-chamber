import Game from '@/components/pages/Game';
import RoomSelection from '@/components/pages/RoomSelection';

export const routes = {
  roomSelection: {
    id: 'roomSelection',
    label: 'Room Selection',
    path: '/',
    icon: 'Home',
    component: RoomSelection
  },
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