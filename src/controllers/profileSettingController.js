import { notification } from './../services/index';
import { profileSetting, message } from './../services/index';
let getProfileSetting = async (req, res) => {
  // Get notification
  let allNotifications = await notification.getAllNotification(req.user._id);
  let requestFriends = await getListFriendRequests(req, res);
  let getAllConversationItems = await message.getAllConversationItems(
    req.user._id
  );
  let getMessageForCoversation =
    getAllConversationItems.getMessageForCoversation;
  return res.render('profileSetting/master', {
    user: req.user,
    locatedFriendRequest: req.flash('locatedFriendRequest'),
    allNotifications: allNotifications,
    requestFriends: requestFriends,
    getMessageForCoversation: getMessageForCoversation,
  });
};

let putChangePassword = async (req, res) => {
  let passInput = req.body;
  try {
    let updatePasswordResult = await profileSetting.changePassword(passInput);
    return res.send(updatePasswordResult);
  } catch (error) {
    return res.send(error);
  }
};

let getFriendRequests = (req, res) => {
  req.flash(
    'locatedFriendRequest',
    '<script>$("#nav-requests-tab").click();</script>'
  );
  return res.redirect('/profile-setting');
};

let acceptFriendRequest = async (req, res) => {
  let data = req.body;
  try {
    let accepted = await profileSetting.acceptFriendRequest(data);
    res.send(true);
  } catch (error) {
    res.send(error);
  }
};

let getListFriendRequests = async (req, res) => {
  let userId = req.user._id;
  try {
    return await profileSetting.getFriendRequests(userId);
  } catch (error) {
    return res.send(error);
  }
};

let deleteRequestFriend = async (req, res) => {
  let data = req.body;
  try {
    let deletedCheck = await profileSetting.deleteRequestFriend(data);
    if (!deletedCheck) {
      return res.send(false);
    }
    return res.send(true);
  } catch (error) {
    return res.send(error);
  }
};
module.exports = {
  getProfileSetting: getProfileSetting,
  putChangePassword: putChangePassword,
  getFriendRequests: getFriendRequests,
  acceptFriendRequest: acceptFriendRequest,
  deleteRequestFriend: deleteRequestFriend,
};
