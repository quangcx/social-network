import { notification, message } from './../services/index';
import {
  bufferToBase64,
  getLastItemOfArray,
  covertTimestamp,
} from './../helper/clientHelper';
let getMessage = async (req, res) => {
  // Get notification
  let allNotifications = await notification.getAllNotification(req.user._id);
  let getAllConversationItems = await message.getAllConversationItems(
    req.user._id
  );
  let caculateMsgUnread = await message.caculateMessageUnread(req.user._id);
  let getMessageForCoversation =
    getAllConversationItems.getMessageForCoversation;
  return res.render('message/master', {
    user: req.user,
    allNotifications: allNotifications,
    getMessageForCoversation: getMessageForCoversation,
    bufferToBase64: bufferToBase64,
    getLastItemOfArray: getLastItemOfArray,
    covertTimestamp: covertTimestamp,
    caculateMsgUnread: caculateMsgUnread,
  });
};

let addNewMessage = async (req, res) => {
  try {
    let sender = {
      id: req.user._id,
      username: req.user.fullname,
      avatar: req.user.avatar,
    };
    let receiverId = req.body.uid;
    let messageVal = req.body.message;

    let newMessage = await message.addNewMessage(
      sender,
      receiverId,
      messageVal
    );
    return res.status(200).send({ msg: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMessage = async (req, res) => {
  let data = {
    userId: req.user._id,
    contactId: req.body.userId,
  };
  try {
    let isRead = await message.readMessage(data);
    if (!isRead) {
      return res.send(false);
    }
    return res.send(true);
  } catch (error) {
    return res.send(error);
  }
};

module.exports = {
  getMessage: getMessage,
  addNewMessage: addNewMessage,
  readMessage: readMessage,
};
