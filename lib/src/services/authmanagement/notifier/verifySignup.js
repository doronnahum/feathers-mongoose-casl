const path = require('path');
const pug = require('pug');
const getLink = require('./getLink');
const sendEmail = require('./sendEmail');
const { getSendGridTemplate, getSendGridTemplateEmail } = require('./util');
const upperFirst = require('lodash/upperfirst');
module.exports = function verifySignup (options, user) {
  const { app } = options;
  const fromEmail = app.get('feathers-mongoose-casl').verifyEmail.fromEmail;
  const returnEmail = app.get('feathers-mongoose-casl').verifyEmail.helpEmail;
  const serverUrl = app.get('serverUrl');
  const defaultMailer = app.get('feathers-mongoose-casl').mailer.service;
  const clientSigninUrl = app.get('feathers-mongoose-casl').clientSigninUrl;
  var emailAccountTemplatesPath = path.join(app.get('feathers-mongoose-casl').srcFolder, 'email-templates', 'account');
  let email;
  const hashLink = getLink(options, 'verify', user.verifyToken);
  const data = {
    logo: '',
    name: user.name || user.email,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: (user.firstName && user.lastName) ? `${upperFirst(user.firstName)} ${upperFirst(user.lastName)}` : null,
    hashLink,
    returnEmail,
    serverUrl,
    clientSigninUrl
  };
  const sendgridTemplate = defaultMailer === 'sendgrid' && getSendGridTemplate(app, 'email-verified');
  if (sendgridTemplate) {
    email = getSendGridTemplateEmail(
      {
        from: fromEmail,
        to: user.email
      }, data, sendgridTemplate);
  } else {
    const templatePath = path.join(emailAccountTemplatesPath, 'email-verified.pug');
    const compiledHTML = pug.compileFile(templatePath)(data);
    email = {
      from: fromEmail,
      to: user.email,
      subject: 'Thank you, your email has been verified',
      html: compiledHTML
    };
  }
  return sendEmail(options, email);
};
