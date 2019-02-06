// Initializes the `sms` service on path `/sms`
const hooks = require('./sms.hooks');
const smsService = require('feathers-twilio/lib').sms;

module.exports = function (app) {
  const paginate = app.get('paginate');
  const options = {
    name: 'sms',
    paginate,
    accountSid: app.get('twilio').sid,
    authToken: app.get('twilio').token,
  };
  // Initialize our service with any options it requires
  app.use('/sms', smsService(options));
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('sms');
  service.hooks(hooks);
};