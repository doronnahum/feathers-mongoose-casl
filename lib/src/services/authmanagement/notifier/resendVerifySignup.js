const path = require('path');
const pug = require('pug');
const getLink = require('./getLink');
const sendEmail = require('./sendEmail');

module.exports =  function resendVerifySignup(options, user) {
  const {app} = options;
  const fromEmail = app.get('verifyEmail').fromEmail;
  const returnEmail = app.get('verifyEmail').helpEmail;
  const emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account');
  const serverUrl = app.get('serverUrl');
  const hashLink = getLink(options, 'verify', user.verifyToken);
  const templatePath = path.join(emailAccountTemplatesPath, 'verify-email.pug');
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
    subject: 'Confirm Signup',
    html: compiledHTML
  };
  return sendEmail(options, email);

};