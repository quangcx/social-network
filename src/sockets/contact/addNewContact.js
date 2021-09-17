import {
  pushSocketIdOfUser,
  emitNotificationToClient,
  removeSocketIdWhenReloadOrDisconnect,
} from './../../helper/socketioHelper';

let addNewContact = (io) => {
  let clients = {};
  io.on('connection', (socket) => {
    // Store socketId of user are connecting to server
    let userId = socket.request.user._id;
    clients = pushSocketIdOfUser(clients, userId, socket.id);

    // Listen to event: 'add-new-contact' from client
    socket.on('add-new-contact', (data) => {
      let currentUser = {
        id: socket.request.user._id,
        fullname: socket.request.user.fullname,
        avatar: socket.request.user.avatar,
      };

      // Emit notification
      if (clients[data.contactId]) {
        emitNotificationToClient(
          clients,
          data.contactId,
          io,
          'response-add-new-contact',
          currentUser
        );
      }
    });

    // Listen to event: user reload or disconnect to server
    socket.on('disconnect', () => {
      clients = removeSocketIdWhenReloadOrDisconnect(clients, userId, socket);
    });
  });
};

module.exports = addNewContact;
