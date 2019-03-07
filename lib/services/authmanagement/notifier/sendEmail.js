module.exports =  function sendEmail(options, email) {
  const {app} = options;
  return app.service('mailer').create(email).then(function (result) {
    app.debug('feathers-mongoose-casl , Sent email', result);
  }).catch(err => {
    app.debug('feathers-mongoose-casl , Error sending email', err);
  });
};