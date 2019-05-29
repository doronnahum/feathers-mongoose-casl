const { GeneralError } = require('@feathersjs/errors');
const debug = require('debug')('feathers-mongoose-casl');
module.exports =  function sendEmail(options, email) {
  const {app} = options;
  return app.service('mailer').create(email).then(function () {
    debug('Sent email');
  }).catch(err => {
    app.error('Error sending email', err);
    throw new GeneralError();
  });
};