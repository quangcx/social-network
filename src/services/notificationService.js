import NotificationModel from './../models/notificationModel';
import UserModel from './../models/userModel';
let getAllNotification = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getAllNotificationByUser(
        userId
      );
      let getNotificationContents = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return getContent(sender, notification.type, notification.isRead);
      });

      resolve(await Promise.all(getNotificationContents));
    } catch (error) {
      reject(error);
    }
  });
};

let getContent = (sender, type, isRead) => {
  let color = 'white';
  if (!isRead) {
    color = 'aquamarine';
  }
  if (type == NotificationModel.types.ADD_CONTACT) {
    return `<div class="notfication-details ${type}" data-uid="${sender.id}" style="background-color: ${color}; cursor: pointer;"><div class="noty-user-img"><img src="images/User/${sender.avatar}" alt="" /></div><div class="notification-info"><h3><a href="#" title="">${sender.fullname}</a></h3><p>Send you a friend request</p><span>1 min ago</span></div></div>`;
  }
  return '';
};

let updateReadNotif = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isReadNotif = await NotificationModel.model.updateReadNotif(data.userId, data.contactId, data.type);
      if(! isReadNotif){
        return reject(false);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {
  getAllNotification: getAllNotification,
  updateReadNotif: updateReadNotif
};
