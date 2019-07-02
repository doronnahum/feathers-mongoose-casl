const getSendGridTemplate = function (app, templateName) {
  const mailConfig = app.get('feathers-mongoose-casl').mailer;
  const sendGridTemplates = mailConfig && mailConfig['sendgrid-authentication-emails-templates'];
  const sendGridTemplate = sendGridTemplates && (sendGridTemplates[templateName] || null);
  return sendGridTemplate;
};

const getSendGridTemplateEmail = function (email, data, sendgridTemplate) {
  return {
    'from': {
      'email': email.from
    },
    'personalizations': [
      {
        'to': [
          {
            'email': email.to
          }
        ],
        'dynamic_template_data': data
      }
    ],
    'template_id': sendgridTemplate
  };
};

module.exports = {
  getSendGridTemplate,
  getSendGridTemplateEmail
};
