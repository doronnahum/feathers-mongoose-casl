let nunjucks = require('nunjucks');


/**
 * @function deletePropertyPath
 * @param {object} obj {user: {name: 'Dor'}}
 * @param {string} path 'user.name'
 * delete value from object with deep support 
 */
const deletePropertyPath = function (obj, path) {
  if (!obj || !path) {
    return;
  }

  if (typeof path === 'string') {
    path = path.split('.');
  }
  
  for (var i = 0; i < path.length - 1; i++) {
  
    obj = obj[path[i]];
  
    if (typeof obj === 'undefined') {
      return;
    }
  }
  delete obj[path.pop()];
};



/**
 * @function compiledRolesTemplate
 * @param {*} roles 
 * @param {*} data 
 * convert [{author: {{ user.id }} }] to [{author: '5c4f44c3e9e159be92c7ce17' }]
 */
const compiledRolesTemplate = function(roles, data){
  var rolesString = JSON.stringify(roles);
  var compiled = nunjucks.renderString(rolesString, data);
  var obj = JSON.parse(compiled);
  return obj;
};


/**
 * @function swaggerAuthenticationCookie
 * we want to enabled swagger token from cookie
 */
function swaggerAuthenticationCookie(hook) {
  if(hook && hook.app.get('host') === 'localhost' &&  hook.params && hook.params.headers && hook.params.headers.referer && hook.params.headers.referer.startsWith('http://localhost:3030/docs')){
    // hook.params.headers.authorization = 
    var rc = hook.params.headers.cookie;
    var list = {};
    rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    if(list['feathers-jwt']){
      hook.params.headers.authorization = list['feathers-jwt'];
    }
  }
}

/**
 * @function asyncForEach
 * @param {*} array 
 * @param {*} callback
 * async for each function
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  deletePropertyPath,
  compiledRolesTemplate,
  swaggerAuthenticationCookie,
  asyncForEach
};