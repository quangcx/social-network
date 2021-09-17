import ContactModel from './../models/contactModel';
import UserModel from './../models/userModel';
import NotificationModel from './../models/notificationModel';
import _ from 'lodash';
let searchUserProfile = (id, keySearch) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedProfileIds = [id];
    let contactsByUser = await ContactModel.findAllByUser(id);
    contactsByUser.forEach((contact) => {
      deprecatedProfileIds.push(contact.userId);
      deprecatedProfileIds.push(contact.contactId);
    });
    deprecatedProfileIds = _.uniqBy(deprecatedProfileIds);

    if (keySearch == '' || keySearch == null) {
      let allUsers = await UserModel.findAllUserExceptMe(deprecatedProfileIds);
      return resolve(allUsers);
    }

    let userProfiles = await UserModel.findAllForAddContact(
      deprecatedProfileIds,
      keySearch
    );
    resolve(userProfiles);
  });
};

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExist = await ContactModel.checkExists(currentUserId, contactId);
    if (contactExist) {
      return reject(false);
    }

    let newContactItem = {
      userId: currentUserId,
      contactId: contactId,
    };
    let newContact = await ContactModel.createNew(newContactItem);

    // Create new notification
    let notifItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT,
    };
    await NotificationModel.model.createNew(notifItem);

    resolve(newContact);
  });
};

let removeRequest = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequest(currentUserId, contactId);
    if (removeReq.result.n == 0) {
      return reject(false);
    }
    // Remove notification
    await NotificationModel.model.removeRequestContactNotification(
      currentUserId,
      contactId,
      NotificationModel.types.ADD_CONTACT
    );
    resolve(true);
  });
};

module.exports = {
  searchUserProfile: searchUserProfile,
  addNew: addNew,
  removeRequest: removeRequest,
};
