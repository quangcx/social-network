import {
  pushSocketIdOfUser,
  emitNotificationToClient,
  removeSocketIdWhenReloadOrDisconnect,
} from './../../helper/socketioHelper';

let chatTextEmoji = (io) => {
  let clients = {};
  io.on('connection', (socket) => {
    // Store socketId of user are connecting to server
    let userId = socket.request.user._id;
    clients = pushSocketIdOfUser(clients, userId, socket.id);

    // Listen to event: 'add-new-contact' from client
    socket.on('chat-text-emoji', (data) => {
      let response = {
        currentUserId: socket.request.user._id,
        message: data.message,
      };

      // Emit notification
      if (clients[data.contactId]) {
        emitNotificationToClient(
          clients,
          data.contactId,
          io,
          'response-chat-text-emoji',
          response
        );
      }
    });

    // Listen to event: user reload or disconnect to server
    socket.on('disconnect', () => {
      clients = removeSocketIdWhenReloadOrDisconnect(clients, userId, socket);
    });
  });
};

module.exports = chatTextEmoji;
