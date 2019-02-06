const path = require('path');
const pug = require('pug');
const sendEmail = require('./sendEmail');

module.exports = function passwordChange(options, user) {
  const {app} = options;
  const fromEmail = app.get('verifyEmail').fromEmail;
  const returnEmail = app.get('verifyEmail').helpEmail;
  var emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account');


  const templatePath = path.join(emailAccountTemplatesPath, 'password-change.pug');
  const compiledHTML = pug.compileFile(templatePath)({
    logo: '',
    name: user.name || user.email,
    returnEmail
  });
  const email = {
    from: fromEmail,
    to: user.email,
    subject: 'Your password was changed',
    html: compiledHTML
  };
  return sendEmail(options, email);
};