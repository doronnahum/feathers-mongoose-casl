const path = require('path');
const pug = require('pug');
const getLink = require('./getLink');
const sendEmail = require('./sendEmail');

module.exports = function sendResetPwd(options, user) {
  const {app} = options;
  const fromEmail = app.get('verifyEmail').fromEmail;
  const returnEmail = app.get('verifyEmail').helpEmail;
  var emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account');
  const serverUrl = app.get('serverUrl');

  const hashLink = getLink(options, 'change-password', user.resetToken);
  const templatePath = path.join(emailAccountTemplatesPath, 'reset-password.pug');
  const compiledHTML = pug.compileFile(templatePath)({
    logo: '',
    name: user.name || user.email,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: (user.firstName &&  user.lastName) ? `${user.firstName} ${user.lastName}` : null,
    hashLink,
    returnEmail,
    serverUrl
  });
  const email = {
    from: fromEmail,
    to: user.email,
    subject: 'Reset Password',
    html: compiledHTML
  };
  return sendEmail(options, email);

};