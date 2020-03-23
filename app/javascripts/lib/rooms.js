import Api from './api';

const Rooms = {
  data: [],

  current: {},

  refresh() {
    Api.roomsAll().then(response => {
      Rooms.data = response;
    });
  },
};

export default Rooms;
