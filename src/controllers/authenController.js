import { validationResult } from 'express-validator/check';
import { transSuccess } from '../../lang/lang';
import { authen } from './../services/index';

let getLoginRegister = (req, res) => {
  return res.render('authen/loginAndRegister', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    status: req.flash('status'),
  });
};

let postRegister = async (req, res) => {
  let errorMsg = [];
  let successMsg = [];

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorMsg.push(item.msg);
    });
    req.flash('errors', errorMsg);
    req.flash('status', 'register');
    return res.redirect('/login-register');
  }

  try {
    let userCreated = await authen.register(
      req.body.name,
      req.body.email,
      req.body.gender,
      req.body.password,
      req.protocol,
      req.get('host')
    );
    successMsg.push(userCreated);
    req.flash('success', successMsg);
    return res.redirect('/login-register');
  } catch (error) {
    errorMsg.push(error);
    req.flash('errors', errorMsg);
    req.flash('status', 'register');
    return res.redirect('/login-register');
  }
};

let verifyAccount = async (req, res) => {
  let errorMsg = [];
  let successMsg = [];
  try {
    let verifyDone = await authen.verifyAccount(req.params.token);
    successMsg.push(verifyDone);
    req.flash('success', successMsg);
    return res.redirect('/login-register');
  } catch (error) {
    errorMsg.push(error);
    req.flash('errors', errorMsg);
    req.flash('status', '');
    return res.redirect('/login-register');
  }
};

let getLogout = (req, res) => {
  // Remove session passport user
  req.logout();
  req.flash('success', transSuccess.logout_account);
  return res.redirect('/login-register');
};

let checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login-register');
  }
  next();
};

let checkLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  verifyAccount: verifyAccount,
  getLogout: getLogout,
  checkLoggedIn: checkLoggedIn,
  checkLoggedOut: checkLoggedOut,
};
