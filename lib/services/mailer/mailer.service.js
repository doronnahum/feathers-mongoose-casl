// Initializes the `mailer` service on path `/mailer`
const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const mg = require('nodemailer-mailgun-transport');

module.exports = function (app) {
  app.use('/mailer', Mailer(mg({
    auth: {
      api_key: app.get('mailgun').apiKey,
      domain: app.get('mailgun').domain
    },
  })));
  
  const service = app.service('mailer');
  service.hooks(hooks);
};