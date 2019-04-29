const path = require('path');
const pug = require('pug');
const getLink = require('./getLink');
const sendEmail = require('./sendEmail');
const {getSendGridTemplate, getSendGridTemplateEmail} = require('./util');

module.exports = function sendResetPwd(options, user) {
  const {app} = options;
  const fromEmail = app.get('feathers-mongoose-casl').verifyEmail.fromEmail;
  const returnEmail = app.get('feathers-mongoose-casl').verifyEmail.helpEmail;
  const defaultMailer = app.get('feathers-mongoose-casl').mailer.service;
  var emailAccountTemplatesPath = path.join(app.get('feathers-mongoose-casl').srcFolder, 'email-templates', 'account');
  const serverUrl = app.get('serverUrl');
  let email;
  const hashLink = getLink(options, 'change-password', user.resetToken);
  const data = {
    logo: '',
    name: user.name || user.email,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: (user.firstName &&  user.lastName) ? `${user.firstName} ${user.lastName}` : null,
    hashLink,
    returnEmail,
    serverUrl
  };
  const sendgridTemplate = defaultMailer === 'sendgrid' && getSendGridTemplate(app, 'reset-password');
  if(sendgridTemplate){
    email = getSendGridTemplateEmail(
      {
        from: fromEmail,
        to: user.email,
      }, data, sendgridTemplate);
  }else{
    const templatePath = path.join(emailAccountTemplatesPath, 'reset-password.pug');
    const compiledHTML = pug.compileFile(templatePath)(data);
    email = {
      from: fromEmail,
      to: user.email,
      subject: 'Reset Password',
      html: compiledHTML
    };
  }
  return sendEmail(options, email);

};