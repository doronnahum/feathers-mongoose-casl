const path = require('path');
const pug = require('pug');
const getLink = require('./getLink');
const sendEmail = require('./sendEmail');

module.exports =  function identityChange(options, user) {
  const {app} = options;
  const fromEmail = app.get('verifyEmail').fromEmail;
  const returnEmail = app.get('verifyEmail').helpEmail;
  const emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account');
  
  const hashLink = getLink(options, 'verifyChanges', user.verifyToken);
  const templatePath = path.join(emailAccountTemplatesPath, 'identity-change.pug');
  const compiledHTML = pug.compileFile(templatePath)({
    logo: '',
    name: user.name || user.email,
    hashLink,
    returnEmail,
    changes: user.verifyChanges
  });
  const email = {
    from: fromEmail,
    to: user.email,
    subject: 'Your account was changed. Please verify the changes',
    html: compiledHTML
  };
  return sendEmail(options, email);

};