import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from './../../models/userModel';
import { transErrors, transSuccess } from './../../../lang/lang';

let LocalStrategy = passportLocal.Strategy;

/**
 * Valid user account at local
 */
let initPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        req.flash('status', '');
        try {
          let user = await UserModel.findByEmailAndUpdateUserLoginTime(email);
          if (!user) {
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            );
          }
          if (!user.local.isActive) {
            return done(
              null,
              false,
              req.flash('errors', transErrors.account_is_not_active)
            );
          }
          let checkPassword = await user.comparePassword(password);
          if (!checkPassword) {
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            );
          }
          // Login successfully
          return done(
            null,
            user,
            req.flash('success', transSuccess.log_in_success)
          );
        } catch (error) {
          return done(
            null,
            false,
            req.flash('errors', transErrors.server_error)
          );
        }
      }
    )
  );

  // Save user into session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // This function is called by passport.session();
  // return userInfo to req.user
  passport.deserializeUser((id, done) => {
    UserModel.findUserById(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        return done(error, null);
      });
  });
};

module.exports = initPassportLocal;
