import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [
        { senderId: senderId },
        { receiverId: receiverId },
        { type: type },
      ],
    }).exec();
  },
  getAllNotificationByUser(userId) {
    return this.find({
      receiverId: userId,
    }).exec();
  },
  updateReadNotif(userId, contactId, type){
    return this.findOneAndUpdate(
      {
        $and: [
          {senderId: contactId},
          {receiverId: userId},
          {type: type}
        ]
      },
      { isRead: true }
    ).exec();
  }
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: 'add_contact',
};

module.exports = {
  model: mongoose.model('notification', NotificationSchema),
  types: NOTIFICATION_TYPES,
};
