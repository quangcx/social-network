import UserModel from './../models/userModel';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import { transErrors, transSuccess, transMailer } from './../../lang/lang';
import sendMail from './../config/mailer';

let saltRounds = 7;

let register = (fullname, email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (!userByEmail.local.isActive) {
        return reject(transErrors.account_is_not_active);
      }
      return reject(transErrors.account_in_used);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    let userItem = {
      username: email,
      fullname: fullname,
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4(),
      },
    };
    let user = await UserModel.createNew(userItem);
    // Send email confirm to user
    // let linkConfirm = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    // sendMail(
    //   email,
    //   transMailer.subject,
    //   transMailer.templateContent(linkConfirm)
    // )
    //   .then((success) => {
    //     resolve(transSuccess.userCreateSuccess(user.local.email));
    //   })
    //   .catch(async (error) => {
    //     // If catch error, remove this user
    //     await UserModel.removeById(user._id);
    //     reject(transMailer.fail_to_send_email);
    //   });
    resolve(transSuccess.userCreateSuccess(user.local.email));
  });
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userFindByToken = await UserModel.findByToken(token);
    if (!userFindByToken) {
      return reject(transErrors.cannot_find_token);
    }
    await UserModel.verify(token);
    resolve(transSuccess.account_is_active);
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount,
};
