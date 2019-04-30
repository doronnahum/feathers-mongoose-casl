const { GeneralError } = require('@feathersjs/errors');
const debug = require('debug')('feathers-mongoose-casl');
module.exports =  function sendEmail(options, email) {
  const {app} = options;
  return app.service('mailer').create(email).then(function (result) {
    debug('Sent email', result);
  }).catch(err => {
    debug('Error sending email', err);
    throw new GeneralError();
  });
};