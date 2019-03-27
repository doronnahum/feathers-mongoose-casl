const isProd = process.env.NODE_ENV === 'production';

module.exports =   function getLink(options, type, hash) {
  const {app} = options;
  var port = (app.get('port') === '80' || isProd) ? '' : ':' + app.get('port');
  var host = (app.get('host') === 'HOST') ? 'localhost' : app.get('host');
  var protocal = `${app.get('protocal') || 'http'}://`;
  var next = app.get('clientSigninUrl');
  var nextParams = next ? `&next=${next}` : '';
  if(isProd) return `${app.get('serverUrl')}/${type}.html?token=${hash}${nextParams}`;
  return `${protocal}${host}${port}/${type}.html?token=${hash}${nextParams}`;
};