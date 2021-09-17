import addNewContact from './contact/addNewContact';
import removeRequestContact from './contact/removeRequestContact';
import confirmRequestOfUser from './contact/confirmRequestOfUser';
import chatTextEmoji from './chat/chatTextEmoji';
import chatVideo from './chat/chatVideo';

/**
 *
 * @param {io} from socket.io in library
 */
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContact(io);
  confirmRequestOfUser(io);
  chatTextEmoji(io);
  chatVideo(io);
  // List of socket
};

module.exports = initSockets;
