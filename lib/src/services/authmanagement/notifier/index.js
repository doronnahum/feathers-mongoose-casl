
const resendVerifySignup = require('./resendVerifySignup');
const verifySignup = require('./verifySignup');
const sendResetPwd = require('./sendResetPwd');
const resetPwd = require('./resetPwd');
const passwordChange = require('./passwordChange');
const identityChange = require('./identityChange');

module.exports = function(app) {
  const options = {app};

  return {
    notifier: function(type, user) {
      switch (type) {
      case 'resendVerifySignup': //sending the user the verification email
        return resendVerifySignup(options, user);
      case 'verifySignup': // confirming verification
        return verifySignup(options, user);
      case 'sendResetPwd':
        return sendResetPwd(options, user);
      case 'resetPwd':
        return resetPwd(options, user);
      case 'passwordChange':
        return passwordChange(options, user);
      case 'identityChange':
        return identityChange(options, user);
      default:
        break;
      }
    },
  };
};