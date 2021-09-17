import { transErrors, transSuccess } from '../../lang/lang';
import UserModel from './../models/userModel';
import PostModel from './../models/postModel';

let changeImage = (data) => {
  return new Promise(async (resolve, reject) => {
    let changeImg = await UserModel.updateImage(data);
    await PostModel.updateImage(data);
    if (changeImg) {
      return resolve(transSuccess.updated_image);
    }
    reject(transErrors.failed_to_update_img);
  });
};

module.exports = {
  changeImage: changeImage,
};
