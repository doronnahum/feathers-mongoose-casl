# send email example

```text
const path = require('path');const pug = require('pug');module.exports = function verifySignup(options, user) {  const {app} = options;  const fromEmail = app.get('verifyEmail').fromEmail;  const returnEmail = app.get('verifyEmail').helpEmail;  const serverUrl = app.get('serverUrl');  const clientSigninUrl = app.get('clientSigninUrl');  var emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account');  const templatePath = path.join(emailAccountTemplatesPath, 'email-verified.pug');  const compiledHTML = pug.compileFile(templatePath)({    logo: '',    name: user.email,    returnEmail,    serverUrl,    clientSigninUrl,  });  const email = {    from: fromEmail,    to: user.email,    subject: 'Thank you, your email has been verified',    html: compiledHTML  };  return app.service('mailer').create(email);};
```

