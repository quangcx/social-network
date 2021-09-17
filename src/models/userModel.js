import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  fullname: { type: String, default: null },
  gender: { type: String, default: 'male' },
  phone: { type: Number, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: 'avatar-default.jpg' },
  coverImg: { type: String, default: 'cover-default.jpg' },
  role: { type: String, default: 'user' },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
  timeUserLogin: { type: Number, default: null },
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({ 'local.email': email }).exec();
  },
  findByToken(token) {
    return this.findOne({ 'local.verifyToken': token }).exec();
  },
  findUserById(id) {
    return this.findById(id).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      { 'local.verifyToken': token },
      { 'local.isActive': true, 'local.verifyToken': null }
    ).exec();
  },
  updateImage(data) {
    if (data.type == 'avatar') {
      return this.findOneAndUpdate(
        { _id: data.userId },
        { avatar: data.nameImg },
        { new: true }
      ).exec();
    } else if (data.type == 'coverImg') {
      return this.findOneAndUpdate(
        { _id: data.userId },
        { coverImg: data.nameImg },
        { new: true }
      ).exec();
    } else return null;
  },
  updatePassword(id, newPassword) {
    return this.findOneAndUpdate(
      { _id: id },
      { 'local.password': newPassword },
      { new: true }
    ).exec();
  },
  findAllForAddContact(deprecatedProfileIds, keySearch) {
    return this.find(
      {
        $and: [
          { _id: { $nin: deprecatedProfileIds } },
          { 'local.isActive': true },
          {
            $or: [
              { username: { $regex: new RegExp(keySearch, 'i') } },
              { fullname: { $regex: new RegExp(keySearch, 'i') } },
              { 'local.email': { $regex: new RegExp(keySearch, 'i') } },
            ],
          },
        ],
      },
      { _id: 1, username: 1, address: 1, avatar: 1 }
    ).exec();
  },
  findAllUserExceptMe(deprecatedProfileIds) {
    return this.find({
      _id: { $nin: deprecatedProfileIds },
    }).exec();
  },
  findByEmailAndUpdateUserLoginTime(email) {
    return this.findOneAndUpdate(
      { 'local.email': email },
      { timeUserLogin: Date.now() },
      { new: true }
    ).exec();
  },
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  },
};

module.exports = mongoose.model('user', UserSchema);
