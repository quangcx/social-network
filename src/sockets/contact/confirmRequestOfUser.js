import {
    pushSocketIdOfUser,
    emitNotificationToClient,
    removeSocketIdWhenReloadOrDisconnect,
  } from './../../helper/socketioHelper';
  
  let removeRequestContact = (io) => {
    let clients = {};
    io.on('connection', (socket) => {
      // Store socketId of user are connecting to server
      let userId = socket.request.user._id;
      clients = pushSocketIdOfUser(clients, userId, socket.id);
  
      // Listen to event: 'accept-request-contact' from client
      socket.on('confirm-accept-request-to-contact', (data) => {
        let currentUser = {
          id: socket.request.user._id,
        };
  
        // Emit notification
        if (clients[data.contactId]) {
          emitNotificationToClient(
            clients,
            data.contactId,
            io,
            'response-confirm-accept-request-to-contact',
            currentUser
          );
        }
      });

      // Listen to event: 'reject-request-contact' from client
      socket.on('confirm-reject-request-to-contact', (data) => {
        let currentUser = {
          id: socket.request.user._id,
        };
  
        // Emit notification
        if (clients[data.contactId]) {
          emitNotificationToClient(
            clients,
            data.contactId,
            io,
            'response-confirm-reject-request-to-contact',
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
  
  module.exports = removeRequestContact;
  