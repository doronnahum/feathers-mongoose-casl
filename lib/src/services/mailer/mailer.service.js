// Initializes the `mailer` service on path `/mailer`
const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const mg = require('nodemailer-mailgun-transport');
const sgMail = require('@sendgrid/mail');


module.exports = function (app) {
  const mailerConfig = app.get('feathers-mongoose-casl').mailer || {service: 'mailgun'};
  
  // mailgun
  if(mailerConfig.service === 'mailgun'){
    app.use('/mailer', Mailer(mg({
      auth: {
        api_key: app.get('mailgun').apiKey,
        domain: app.get('mailgun').domain
      },
    })));
  }
  
  // sendgrid
  else if(mailerConfig.service === 'sendgrid'){
    app.use('/mailer', {
      async create(data){
        sgMail.setApiKey(app.get('sendgrid').apiKey);
        const res = await sgMail.send(data);
        return Promise.resolve(res);
      }
    });
  }
  const service = app.service('mailer');
  service.hooks(hooks);
};