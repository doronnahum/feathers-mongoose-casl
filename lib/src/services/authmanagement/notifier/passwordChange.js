const path = require('path');
const pug = require('pug');
const sendEmail = require('./sendEmail');
const { getSendGridTemplate, getSendGridTemplateEmail } = require('./util');

module.exports = function passwordChange (options, user) {
  const { app } = options;
  const fromEmail = app.get('feathers-mongoose-casl').verifyEmail.fromEmail;
  const returnEmail = app.get('feathers-mongoose-casl').verifyEmail.helpEmail;
  const defaultMailer = app.get('feathers-mongoose-casl').mailer.service;
  var emailAccountTemplatesPath = path.join(app.get('feathers-mongoose-casl').srcFolder, 'email-templates', 'account');
  const serverUrl = app.get('serverUrl');
  const clientSigninUrl = app.get('feathers-mongoose-casl').clientSigninUrl;
  let email;
  const data = {
    logo: '',
    name: user.name || user.email,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : null,
    returnEmail,
    serverUrl,
    clientSigninUrl
  };
  const sendgridTemplate = defaultMailer === 'sendgrid' && getSendGridTemplate(app, 'password-change');
  if (sendgridTemplate) {
    email = getSendGridTemplateEmail(
      {
        from: fromEmail,
        to: user.email
      }, data, sendgridTemplate);
  } else {
    const templatePath = path.join(emailAccountTemplatesPath, 'password-change.pug');
    const compiledHTML = pug.compileFile(templatePath)(data);
    email = {
      from: fromEmail,
      to: user.email,
      subject: 'Your password was changed',
      html: compiledHTML
    };
  }
  return sendEmail(options, email);
};
