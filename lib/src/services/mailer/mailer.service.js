// Initializes the `mailer` service on path `/mailer`
const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const mg = require('nodemailer-mailgun-transport');
const sgMail = require('@sendgrid/mail');

module.exports = function (app) {
  const mailerConfig = app.get('feathers-mongoose-casl').mailer || {};
  let applayEmailService = false;
  // Install check
  if (!mailerConfig.service) {
    app.info('feathers-mongoose-casl missing mailer at config file, use mailer to define the mailer service');
  }
  // Install check end
  // mailgun
  if (mailerConfig.service === 'mailgun') {
    if (!app.get('mailgun') || !app.get('mailgun').apiKey || !app.get('mailgun').domain) {
      throw new Error('feathers-mongoose-casl missing mailgun apiKey\domain at config file');
    }
    applayEmailService = true;
    app.use('/mailer', Mailer(mg({
      auth: {
        api_key: app.get('mailgun').apiKey,
        domain: app.get('mailgun').domain
      }
    })));
  }

  // sendgrid
  else if (mailerConfig.service === 'sendgrid') {
    if (!app.get('sendgrid') || !app.get('sendgrid').apiKey) {
      throw new Error('feathers-mongoose-casl missing mailgun apiKey at config file');
    }
    applayEmailService = true;
    app.use('/mailer', {
      async create (data) {
        sgMail.setApiKey(app.get('sendgrid').apiKey);
        const res = await sgMail.send(data);
        return Promise.resolve(res);
      }
    });
  }
  if (applayEmailService) {
    const service = app.service('mailer');
    service.hooks(hooks);
  }
};
