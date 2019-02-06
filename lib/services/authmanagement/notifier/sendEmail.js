module.exports =  function sendEmail(options, email) {
  const {app} = options;
  return app.service('mailer').create(email).then(function (result) {
    app.info('Sent email', result);
  }).catch(err => {
    app.info('Error sending email', err);
  });
};