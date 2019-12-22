# Production

### Things you must do before you publish your app

1. **Clean config file** You can remove any keys you have not used, such as Google-cloud or S3 
2. **Ensure your dependencies are secure open this** [best-practice-security](https://expressjs.com/en/advanced/best-practice-security.html) and see how to install snyk 
3. **Change cookie name** Open config/\[env\].json file and rename cookie.name 
4. Cross Site Request Forgery Save JWT in localstorage and not in the cookie [read this](https://github.com/feathersjs/docs/blob/master/SECURITY.md#some-of-the-technologies-we-employ) **Server** Open config/production.json  set cookie.enabled to false **Client** import localForage from 'localforage'; const feathersApp = require\('@feathersjs/feathers'\); const auth = require\('@feathersjs/authentication-client'\); const axios = require\('axios'\); const rest = require\('@feathersjs/rest-client'\); const feathers = feathersApp\(\); const restClient = rest\(envConfig.url\); feathers.configure\(restClient.axios\(axios\)\); feathers.configure\(auth\({ ... storage: localForage }\)\) 
5. Check the advanced tab for more tools and tips:

{% page-ref page="../advanced/" %}

  


