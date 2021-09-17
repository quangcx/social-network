import {
  pushSocketIdOfUser,
  emitNotificationToClient,
  removeSocketIdWhenReloadOrDisconnect,
} from './../../helper/socketioHelper';

let chatVideo = (io) => {
  let clients = {};
  io.on('connection', (socket) => {
    // Store socketId of user are connecting to server
    let userId = socket.request.user._id;
    clients = pushSocketIdOfUser(clients, userId, socket.id);

    socket.on('caller-check-listener-online', (data) => {
      if (clients[data.listenerId]) {
        // Online
        let response = {
          callerId: userId,
          listenerId: data.listenerId,
          callerName: data.callerName,
        };
        emitNotificationToClient(
          clients,
          data.listenerId,
          io,
          'server-request-peer-id-of-listener',
          response
        );
      } else {
        // Offline
        socket.emit('server-inform-listener-offline');
      }
    });

    socket.on('listener-emit-peer-id-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotificationToClient(
          clients,
          data.callerId,
          io,
          'server-send-peer-id-of-listener-to-caller',
          response
        );
      }
    });

    socket.on('caller-request-call-action-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.listenerId]) {
        emitNotificationToClient(
          clients,
          data.listenerId,
          io,
          'server-send-request-call-to-listener',
          response
        );
      }
    });

    socket.on('caller-cancel-request-call-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.listenerId]) {
        emitNotificationToClient(
          clients,
          data.listenerId,
          io,
          'server-send-cancel-request-call-to-listener',
          response
        );
      }
    });

    socket.on('listener-reject-request-call-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotificationToClient(
          clients,
          data.callerId,
          io,
          'server-send-reject-call-to-caller',
          response
        );
      }
    });

    socket.on('listener-accept-request-call-to-server', (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotificationToClient(
          clients,
          data.callerId,
          io,
          'server-send-accept-call-to-caller',
          response
        );
      }
      if (clients[data.listenerId]) {
        emitNotificationToClient(
          clients,
          data.listenerId,
          io,
          'server-send-accept-call-to-listener',
          response
        );
      }
    });

    socket.on('caller-send-call-cancelation-to-listener', (data) => {
      if (clients[data.listenerId]) {
        emitNotificationToClient(
          clients,
          data.listenerId,
          io,
          'response-caller-send-call-cancelation-to-listener'
        );
      }
    });

    socket.on('listener-send-call-cancelation-to-caller', (data) => {
      if (clients[data.callerId]) {
        emitNotificationToClient(
          clients,
          data.callerId,
          io,
          'response-listener-send-call-cancelation-to-caller'
        );
      }
    });

    // Listen to event: user reload or disconnect to server
    socket.on('disconnect', () => {
      clients = removeSocketIdWhenReloadOrDisconnect(clients, userId, socket);
    });
  });
};

module.exports = chatVideo;
