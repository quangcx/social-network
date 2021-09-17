import { check } from 'express-validator/check';
import { transValidation } from './../../lang/lang';

let register = [
  check('email', transValidation.email_incorrect).isEmail().trim(),
  check('password', transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    ),
  check(
    'repeat-password',
    transValidation.password_confirmation_incorrect
  ).custom((value, { req }) => {
    return value === req.body.password;
  }),
];

module.exports = {
  register: register,
};
