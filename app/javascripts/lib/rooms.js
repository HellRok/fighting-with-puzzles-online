import Api from './api';

const Rooms = {
  data: [],

  refresh() {
    Api.roomsAll().then(response => {
      Rooms.data = response;
    });
  },
};

export default Rooms;
