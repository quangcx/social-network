import { notification } from './../services/index';
import { searchUser, message } from './../services/index';
let getSeachUser = async (req, res) => {
  let id = req.user._id;
  let keySearch = req.query.search;
  // Get notification
  let allNotifications = await notification.getAllNotification(req.user._id);
  let getAllConversationItems = await message.getAllConversationItems(
    req.user._id
  );
  let getMessageForCoversation =
    getAllConversationItems.getMessageForCoversation;
  if (!/^[a-zA-Z0-9_ ]*$/.test(keySearch)) {
    return res.render('searchUser/master', {
      users: '',
      user: req.user,
      errors: 'Your key search is invalid. Please try again.',
      allNotifications: allNotifications,
    });
  }
  try {
    let users = await searchUser.searchUserProfile(id, keySearch);
    return res.render('searchUser/master', {
      users,
      user: req.user,
      errors: '',
      allNotifications: allNotifications,
      getMessageForCoversation: getMessageForCoversation,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let addNewContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    // Create a new contact
    let newContact = await searchUser.addNew(currentUserId, contactId);
    res.status(200).send({ success: !!newContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await searchUser.removeRequest(currentUserId, contactId);
    res.status(200).send({ success: !!removeReq });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getSeachUser: getSeachUser,
  addNewContact: addNewContact,
  removeRequestContact: removeRequestContact,
};
