import express from 'express';
import {
  home,
  authen,
  message,
  profile,
  searchUser,
  profileSetting,
} from './../controllers/index';

import { authenValid } from './../validation/index';
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';

// Init all passport
initPassportLocal();

let router = express.Router();

/**
 * Init all routes
 */
let initRoutes = (app) => {
  router.get('/', authen.checkLoggedIn, home.getHome);
  router.get('/login-register', authen.checkLoggedOut, authen.getLoginRegister);
  router.get('/message', authen.checkLoggedIn, message.getMessage);
  router.get('/profile', authen.checkLoggedIn, profile.getProfile);
  router.get('/search-user', authen.checkLoggedIn, searchUser.getSeachUser);
  router.get(
    '/profile-setting',
    authen.checkLoggedIn,
    profileSetting.getProfileSetting
  );
  // Verify Account
  router.get('/verify/:token', authen.checkLoggedOut, authen.verifyAccount);
  // Log out of Application
  router.get('/logout', authen.checkLoggedIn, authen.getLogout);
  // Get friend requests
  router.get(
    '/friend-requests',
    authen.checkLoggedIn,
    profileSetting.getFriendRequests
  );

  router.post(
    '/register',
    authen.checkLoggedOut,
    authenValid.register,
    authen.postRegister
  );
  // Login
  router.post(
    '/login',
    authen.checkLoggedOut,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login-register',
      successFlash: true,
      failureFlash: true,
    })
  );
  router.post('/new-post', authen.checkLoggedIn, home.postNewPost);
  router.post(
    '/contact/add-new',
    authen.checkLoggedIn,
    searchUser.addNewContact
  );
  router.post('/message/add-new', authen.checkLoggedIn, message.addNewMessage);

  router.put('/change-photo', authen.checkLoggedIn, profile.postChangePhoto);
  router.put(
    '/change-password',
    authen.checkLoggedIn,
    profileSetting.putChangePassword
  );
  // Read notification
  router.put('/read-notification', authen.checkLoggedIn, home.readNotification);
  // Accept friend request
  router.put(
    '/accept-friend',
    authen.checkLoggedIn,
    profileSetting.acceptFriendRequest
  );
  // Read message
  router.put('/read-message', authen.checkLoggedIn, message.readMessage);

  router.delete(
    '/remove-request-contact',
    authen.checkLoggedIn,
    searchUser.removeRequestContact
  );
  router.delete(
    '/delete-friend',
    authen.checkLoggedIn,
    profileSetting.deleteRequestFriend
  );

  return app.use('/', router);
};

module.exports = initRoutes;
