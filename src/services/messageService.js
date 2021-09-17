import UserModel from './../models/userModel';
import ContactModel from './../models/contactModel';
import ChatGroupModel from './../models/chatGroupModel';
import MessageModel from './../models/messageModel';
import _ from 'lodash';
let getAllConversationItems = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(userId);
      let usersPromise = contacts.map(async (contact) => {
        if (contact.contactId == userId) {
          let getUserContact = await UserModel.findUserById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.findUserById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });
      let userConversations = await Promise.all(usersPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(userId);
      let allConversations = [...userConversations, ...groupConversations];
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });

      let getMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();
        if (false) {
          /*conversation.members*/
          let getMessage = await MessageModel.model.getMessagesInGroup(
            conversation._id
          );
          conversation.messages = getMessage;
        } else {
          let getMessage = await MessageModel.model.getMessages(
            userId,
            conversation._id
          );
          conversation.messages = getMessage;
        }
        return conversation;
      });
      let getMessageForCoversation = await Promise.all(getMessagesPromise);
      getMessageForCoversation = _.sortBy(getMessageForCoversation, (item) => {
        return -item.updatedAt;
      });

      resolve({
        getMessageForCoversation: getMessageForCoversation,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let addNewMessage = (sender, receiverId, messageVal) => {
  return new Promise(async (resolve, reject) => {
    try {
      let getUserReceiver = await UserModel.findUserById(receiverId);
      if (!getUserReceiver) {
        return reject('Cannot find user and conversation.');
      }
      let receiver = {
        id: getUserReceiver._id,
        username: getUserReceiver.fullname,
        avatar: getUserReceiver.avatar,
      };
      let newMessageItem = {
        senderId: sender.id,
        receiverId: receiver.id,
        conversationType: MessageModel.conversationTypes.PERSONAL,
        messageType: MessageModel.messageTypes.TEXT,
        sender: sender,
        receiver: receiver,
        text: messageVal,
        createdAt: Date.now(),
      };
      let newMessage = await MessageModel.model.createNew(newMessageItem);
      await ContactModel.updateWhenHasNewMessage(
        sender.id,
        getUserReceiver._id
      );
      resolve(newMessage);
    } catch (error) {
      reject(error);
    }
  });
};

let readMessage = (data) => {
  return new Promise(async (resolve, reject) => {
    let isRead = await MessageModel.model.readMessage(
      data.userId,
      data.contactId
    );
    if (!isRead) {
      return reject(false);
    }
    resolve(true);
  });
};

let caculateMessageUnread = (userId) => {
  return new Promise(async (resolve, reject) => {
    let allFriends = await ContactModel.getFriends(userId);
    let caculateMsgPromise = allFriends.map(async (friend) => {
      let friendId = friend.userId == userId ? friend.contactId : friend.userId;
      let messageUnRead = await MessageModel.model.allMessageUnRead(
        userId,
        friendId
      );
      return {
        friend: friendId,
        total: messageUnRead.length,
      };
    });
    let caculateMsg = await Promise.all(caculateMsgPromise);
    resolve(caculateMsg);
  });
};
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewMessage: addNewMessage,
  readMessage: readMessage,
  caculateMessageUnread: caculateMessageUnread,
};
