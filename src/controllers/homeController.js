import { notification, home, message } from './../services/index';
import { covertTimestamp } from './../helper/clientHelper';
let getHome = async (req, res) => {
  // Get notification
  let allNotifications = await notification.getAllNotification(req.user._id);
  let numberOfFriends = await home.getFriends(req.user._id);
  let allPosts = await home.getAllPostsOfFriend(req.user._id);
  let getAllConversationItems = await message.getAllConversationItems(
    req.user._id
  );
  let getMessageForCoversation =
    getAllConversationItems.getMessageForCoversation;
  return res.status(200).send({
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    allNotifications: allNotifications,
    numberOfFriends: numberOfFriends,
    allPosts: allPosts,
    covertTimestamp: covertTimestamp,
    getMessageForCoversation: getMessageForCoversation,
  });
};

let postNewPost = async (req, res) => {
  try {
    let newPost = await home.postNewPost(req.user, req.body);
    return res.send(newPost);
  } catch (error) {
    return res.send(error);
  }
};

let readNotification = async (req, res) => {
  try {
    let readNotif = await notification.updateReadNotif(req.body);
    res.send(readNotif);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getHome: getHome,
  postNewPost: postNewPost,
  readNotification: readNotification,
};
