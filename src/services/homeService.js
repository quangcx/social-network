import ContactModel from './../models/contactModel';
import PostModel from './../models/postModel';
import _ from 'lodash';

let getFriends = (userId) => {
  return new Promise(async (resolve, reject) => {
    let friendNumbers = await ContactModel.getFriends(userId);
    if (!friendNumbers) {
      return resolve(0);
    }
    resolve(friendNumbers.length);
  });
};

let getFriendRequestNum = (userId) => {
  return new Promise(async (resolve, reject) => {
    let requestNum = await ContactModel.getRequestNum(userId);
    if (!requestNum) {
      return resolve(0);
    }
    resolve(requestNum.length);
  });
};

let getAllPosts = (userId) => {
  return new Promise(async (resolve, reject) => {
    let allPost = await PostModel.getAllPosts(userId);
    if (!allPost) {
      return resolve("Don't have any posts.");
    }
    resolve(allPost);
  });
};

let getAllPostsOfFriend = (userId) => {
  return new Promise(async (resolve, reject) => {
    let allPostOfMine = await PostModel.getAllPosts(userId);
    let listFriend = await ContactModel.getFriends(userId);
    let allPostOfFriendPromise = listFriend.map(async (friend) => {
      if (friend.userId == userId) {
        let postOfFriend = await PostModel.getAllPosts(friend.contactId);
        return postOfFriend;
      } else {
        let postOfFriend = await PostModel.getAllPosts(friend.userId);
        return postOfFriend;
      }
    });
    let allPostOfFriend = await Promise.all(allPostOfFriendPromise);
    let mergeArr = [];
    allPostOfFriend.forEach((item) => {
      mergeArr = [...mergeArr, ...item];
    });
    let allPosts = [...allPostOfMine, ...mergeArr];
    allPosts = _.sortBy(allPosts, (item) => {
      return -item.createdAt;
    });
    resolve(allPosts);
  });
};

let postNewPost = (currentUser, data) => {
  return new Promise(async (resolve, reject) => {
    let imageFile = null;
    if (data.image) {
      imageFile = data.image;
    }
    let postItem = {
      userId: currentUser._id,
      user: {
        fullname: currentUser.fullname,
        avatar: currentUser.avatar,
      },
      title: data.title,
      image: imageFile,
      content: data.content,
    };

    let newPostItem = await PostModel.createNew(postItem);
    if (!newPostItem) {
      return reject('Can not create a new post');
    }
    resolve(newPostItem);
  });
};
module.exports = {
  getFriends: getFriends,
  getFriendRequestNum: getFriendRequestNum,
  getAllPosts: getAllPosts,
  postNewPost: postNewPost,
  getAllPostsOfFriend: getAllPostsOfFriend,
};
