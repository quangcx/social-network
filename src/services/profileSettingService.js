import UserModel from './../models/userModel';
import ContactModel from './../models/contactModel';
import bcrypt from 'bcrypt';
import {transErrors, transSuccess} from './../../lang/lang';
let changePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    let id = data.id;
    let oldPassword = data.oldPassword;
    let newPassword = data.newPassword;
  
    // Check oldPassword is correct or not
    let user = await UserModel.findUserById(id);
    let checkOldPassword = await user.comparePassword(oldPassword);
    if(!checkOldPassword){
      return reject(transErrors.old_password_wrong);
    }

    // Encrypt new password prepare for update
    let saltRounds = 7;
    let salt = bcrypt.genSaltSync(saltRounds);
    let newPassEncrypt = bcrypt.hashSync(newPassword, salt);
    // End encrypt

    let updatePassUser = await UserModel.updatePassword(id, newPassEncrypt);
    if(!updatePassUser){
      return reject(transErrors.failed_to_update_password);
    }
    resolve(transSuccess.password_updated);
  });
};

let acceptFriendRequest = (data) => {
  return new Promise(async (resolve, reject) => {
    let checkAccepted = await ContactModel.acceptFriendRequest(data.userId, data.contactId);
    if(!checkAccepted){
      return reject(false);
    }
    resolve(true);
  })
}

let getFriendRequests = (userId) => {
  return new Promise(async (resolve, reject) => {
    let userSendRequestId = await ContactModel.findByContactId(userId);
    let result = userSendRequestId.map(async userModel => {
      let user  = await UserModel.findUserById(userModel.userId);
      let userItem = {
        userId: user._id,
        fullname: user.fullname,
        avatar: user.avatar,
      }
      return userItem;
    });
    
    resolve(await Promise.all(result));
  });
}

let deleteRequestFriend = (data) => {
  return new Promise(async (resolve, reject) => {
    let userId = data.userId;
    let contactId = data.contactId;
    let deleteRequest = await ContactModel.deleteRequestFriend(userId, contactId);
    if(!deleteRequest){
      return reject(false);
    }
    resolve(true);
  })
}

module.exports = {
  changePassword: changePassword,
  acceptFriendRequest: acceptFriendRequest,
  getFriendRequests: getFriendRequests,
  deleteRequestFriend: deleteRequestFriend
};
