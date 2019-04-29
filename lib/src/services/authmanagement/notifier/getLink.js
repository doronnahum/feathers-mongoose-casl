const isProd = process.env.NODE_ENV === 'production';

module.exports =   function getLink(options, type, hash) {
  const {app} = options;
  var port = (app.get('port') === '80' || isProd) ? '' : ':' + app.get('port');
  var host = (app.get('host') === 'HOST') ? 'localhost' : app.get('host');
  var next = app.get('feathers-mongoose-casl').clientSigninUrl;
  var nextParams = next ? `&next=${next}` : '';
  if(type === 'change-password'){
    const changePasswordClientUrl = app.get('feathers-mongoose-casl').changePasswordClientUrl;
    if(changePasswordClientUrl) return `${changePasswordClientUrl}?token=${hash}${nextParams}`;
  }
  if(isProd) return `${app.get('serverUrl')}/${type}.html?token=${hash}${nextParams}`;
  return `http://${host}${port}/${type}.html?token=${hash}${nextParams}`;
};