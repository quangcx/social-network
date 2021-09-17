export const transValidation = {
  email_incorrect: 'Email must have the following type: abc@gmail.com',
  password_incorrect:
    'Password must contain at least 8 characters, including uppercase letters, lower case letters, numbers and special characters.',
  password_confirmation_incorrect: 'Repeat password is incorrect.',
};

export const transErrors = {
  account_in_used: 'Email was already in used.',
  account_is_not_active: 'Email was created but not active yet.',
  cannot_find_token: 'Can not find your token to our verification.',
  login_failed: 'Your email or password are incorrect.',
  server_error: 'This is an unexpected error. Please try again later.',
  failed_to_update_img: 'Failed to update your image. Please try again.',
  old_password_wrong: 'Your old password is incorrect.',
  failed_to_update_password: 'Failed to update your password. Please try again.'
};

export const transSuccess = {
  userCreateSuccess: (mail) => {
    return `This account <strong>${mail}</strong> has been created successfully, please check your email to confirm the policy`;
  },
  account_is_active:
    'Your account is active, please login and use the application.',
  log_in_success: 'Welcome to our social networking.',
  logout_account: 'Logout successfully.',
  updated_image: 'Update your image successfully.',
  password_updated: 'Update your password successfully.'
};

export const transMailer = {
  subject: 'This mail is for your confirmation.',
  templateContent: (linkConfirm) => {
    return `
      <h2>Please click the link below to confirm your verification:</h2>
      <h3><a href="${linkConfirm}" target="blank">${linkConfirm}</a></h3>
    `;
  },
  fail_to_send_email:
    'We got error when send email for you, please register again.',
};
