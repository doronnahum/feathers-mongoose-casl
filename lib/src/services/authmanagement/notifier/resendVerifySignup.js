const path = require('path');
const pug = require('pug');
const getLink = require('./getLink');
const sendEmail = require('./sendEmail');
const {getSendGridTemplate, getSendGridTemplateEmail} = require('./util');

module.exports =  function resendVerifySignup(options, user) {
  const {app} = options;
  const fromEmail = app.get('verifyEmail').fromEmail;
  const defaultMailer = app.get('feathers-mongoose-casl').mailer.service;
  const returnEmail = app.get('verifyEmail').helpEmail;
  const emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account');
  const serverUrl = app.get('serverUrl');
  const hashLink = getLink(options, 'verify', user.verifyToken);
  let email;
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
  const sendgridTemplate = defaultMailer === 'sendgrid' && getSendGridTemplate(app, 'verify-email');
  if(sendgridTemplate){
    email = getSendGridTemplateEmail(
      {
        from: fromEmail,
        to: user.email,
      }, data, sendgridTemplate);
  }else{
    const templatePath = path.join(emailAccountTemplatesPath, 'verify-email.pug');
    const compiledHTML = pug.compileFile(templatePath)(data);
    email = {
      from: fromEmail,
      to: user.email,
      subject: 'Confirm Signup',
      html: compiledHTML
    };
  }
  return sendEmail(options, email);

};