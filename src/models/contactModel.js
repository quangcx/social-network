import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findAllByUser(id) {
    return this.find({
      $or: [{ userId: id }, { contactId: id }],
    }).exec();
  },
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] },
      ],
    }).exec();
  },
  removeRequest(userId, contactId) {
    return this.remove({
      $and: [{ userId: userId }, { contactId: contactId }],
    }).exec();
  },
  acceptFriendRequest(userId, contactId) {
    return this.findOneAndUpdate(
      {
        $or: [
          { $and: [{ userId: userId }, { contactId: contactId }] },
          { $and: [{ userId: contactId }, { contactId: userId }] },
        ],
      },
      { status: true, updatedAt: Date.now() },
      { new: true }
    ).exec();
  },
  findByContactId(userId) {
    return this.find(
      {
        $and: [{ contactId: userId }, { status: false }],
      },
      {
        userId: 1,
        _id: 0,
      }
    ).exec();
  },
  getContacts(userId) {
    return this.find({
      $or: [
        { $and: [{ userId: userId }, { status: true }] },
        { $and: [{ contactId: userId }, { status: true }] },
      ],
    })
      .sort({ updatedAt: -1 })
      .exec();
  },
  deleteRequestFriend(userId, contactId) {
    return this.remove({
      $and: [{ userId: contactId }, { contactId: userId }],
    }).exec();
  },
  updateWhenHasNewMessage(userId, contactId) {
    return this.update(
      {
        $or: [
          {
            $and: [
              { userId: userId },
              { contactId: contactId },
              { status: true },
            ],
          },
          {
            $and: [
              { userId: contactId },
              { contactId: userId },
              { status: true },
            ],
          },
        ],
      },
      { updatedAt: Date.now() },
      { new: true }
    ).exec();
  },
  getFriends(userId) {
    return this.find({
      $or: [
        { $and: [{ userId: userId }, { status: true }] },
        { $and: [{ contactId: userId }, { status: true }] },
      ],
    }).exec();
  },
  getRequestNum(userId) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    }).exec();
  },
};

module.exports = mongoose.model('contact', ContactSchema);
