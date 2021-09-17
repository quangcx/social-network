import { profile, notification, home, message } from './../services/index';
import { covertTimestamp } from './../helper/clientHelper';
let getProfile = async (req, res) => {
  // Get notification
  let allNotifications = await notification.getAllNotification(req.user._id);
  let getFriends = await home.getFriends(req.user._id);
  let getRequestNum = await home.getFriendRequestNum(req.user._id);
  let allPosts = await home.getAllPosts(req.user._id);
  let getAllConversationItems = await message.getAllConversationItems(
    req.user._id
  );
  let getMessageForCoversation =
    getAllConversationItems.getMessageForCoversation;
  return res.render('profile/master', {
    user: req.user,
    allNotifications: allNotifications,
    getFriends: getFriends,
    getRequestNum: getRequestNum,
    allPosts: allPosts,
    covertTimestamp: covertTimestamp,
    getMessageForCoversation: getMessageForCoversation,
  });
};

let postChangePhoto = async (req, res) => {
  try {
    let updateImageUser = await profile.changeImage(req.body);
    res.send(updateImageUser);
  } catch (error) {
    res.send('Have suddenly error.');
  }
};
module.exports = {
  getProfile: getProfile,
  postChangePhoto: postChangePhoto,
};
