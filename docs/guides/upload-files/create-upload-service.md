---
description: >-
  In this guide, we will create a new collection with file field that will be
  saved in the public folder in the server, after you finish this guide you can
  change the storage in google-cloud or aws
---

# Create upload service

###  **1 - Generate a new service** 

Create a new mongoose service that going to record all the files.  
in this example we going to call the service 'organizations-files'

```bash
feathers generate service? What kind of service is it? Mongoose? What is the name of the service? organizations-files? Which path should the service be registered on? /organizations-files? Does the service require authentication? No
```

### 2 - Create new validators file

Create organizations-file.validators.js in the validators folder  
**path:**  src &gt; validators &gt; organizations-files.validators.js

```javascript
const {Joi, enums} = require('feathers-mongoose-casl');const getJoiObject = function(withRequired) {  const required = withRequired ? 'required' : 'optional';  return Joi.object({    // Data from user    displayName: Joi.string()[required](),        // File will be the file url in the storage - the uploadMiddleware will handle this value    file: Joi.string().meta({ dashboard: { doc: {inputType: 'file'}, list: {type: 'link'} } }),        // Data from the file    originalName: Joi.string(),       // The user that uplaod the file    user: Joi.objectId()      .meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' })      .meta({ dashboard: { doc: {readOnly: true} } }),        // Data from the upload service    fileId: Joi.string().meta({ dashboard: { hide: 1 }}),    storage: Joi.string().valid(      enums.STORAGE_TYPES['local-public'], // When file saved on local-storage      enums.STORAGE_TYPES['others'], // When user pass link to file    ).meta({ dashboard: { hide: 1 }})  });};module.exports = getJoiObject;
```

### 3. Add service m**iddleware** 

Inside the  organizations-files.service.js , add the **uploadMiddleware   
path :** src &gt; services &gt; organizations-files &gt; organizations-files.service.js

* We have set in the example _sys\_admin_ ability - change it to your needs

{% tabs %}
{% tab title="uploadMiddleware" %}
```javascript
// Initializes the `organizations-files` service on path `/organizations-files`const createModel = require('../../models/organizations-files.model');const hooks = require('./organizations-files.hooks');const { createService,  STORAGE_TYPES, uploadMiddleware} = require('feathers-mongoose-casl');module.exports = function (app) {  const Model = createModel(app);  const paginate = app.get('paginate');  const options = {    Model,    paginate,    serviceRules: [      {        actions: ['manage'],        roles: ['sys_admin']      }    ]  };  // Initialize our service with any options it requires  app.use('/organizations-files',    uploadMiddleware({      app,      fileKeyName: 'file',      serviceName: 'organizations-files',      storageService: STORAGE_TYPES['local-public'],      publicRead: false,      mimetypes: null // optional - array of mimetypes to allow    }),    createService(options));  // Get our initialized service so that we can register hooks  const service = app.service('organizations-files');  service.hooks(hooks);};
```
{% endtab %}
{% endtabs %}

### 4 - Update service model

**path:** src &gt; models &gt; organizations-files.model.js

```javascript
//organizations-files-model.js - A mongoose model// // See http://mongoosejs.com/docs/models.html// for more of what you can do here.const organizationFilesValidators = require('../validators/organizations-files.validators');const { createModelFromJoi } = require('../feathers-mongoose-casl');module.exports = function (app) {  return createModelFromJoi(app, 'organizations-files',organizationFilesValidators);};
```

### 5 - Update  service hooks

**path:** src &gt; services &gt; organizations-files &gt; organizations-files.hooks.js

```javascript
const {hooks} = require('feathers-mongoose-casl');const {uploadsHooks} = hooks;const uploadHookConfig = {  fileKeyName: 'file',  userKeyName: 'user',  publicRead: false,  singUrlKeyName: 'file'};module.exports = {  before: {    all: [uploadsHooks(uploadHookConfig)],    find: [],    get: [],    create: [],    update: [],    patch: [],    remove: []  },  after: {    all: [uploadsHooks(uploadHookConfig)],    find: [],    get: [],    create: [],    update: [],    patch: [],    remove: []  },  error: {    all: [],    find: [],    get: [],    create: [],    update: [],    patch: [],    remove: []  }};
```

### 6 - import upload service

**path:** src &gt; services &gt; index.js

```text
const { services } = require('feathers-mongoose-casl');module.exports = function (app) {    ...    app.configure(services.uploads); // uploads file to aws/google or to local folder.(Not exposed to the client)}
```

### 7 - Validate config file

**path:** config\default.json

Check that your not missing this in your configuration file

```javascript
{  "host": "localhost",  "port": 3030,  "public": "../public/",  "s3": { // Optional - only if you want to use s3    "bucket": "bucket....",    "accessKeyId": "accessKeyId....",    "secretAccessKey": "secretAccessKey....",    "signedUrlExpires" : 900  },  "google-cloud": { // Optional - only if you want to use google-cloud    "projectId": "google-cloud-id",    "bucket": "MyCompany-dev",    "keyFilename": "../src/secret-files/google-key.json", /* The place you save your google json file*/    "signedUrlExpires" : 900  },  "feathers-mongoose-casl": {  ...      "privateFolder": "../private-files",    "privateFilesAbilityCache": {      "enabled": true,      "local-config": {        "max": 100,        "maxAge": 3600000      }    },    "uploads": {      "services": {        "s3": false,        "local-private": true,        "local-public": true,        "google-cloud": false      },      "defaultFileService": "local-private",      "blockDeleteDocumentWhenDeleteFileFailed": false,      "blockUpdateDocumentWhenReplaceFileFailed": false    }  }
```

### 8 - Done!

test the service

test from dashboard :  
1\) open [feathersjs-mongoose-casl-admin](../../start-new-project-1/install-feathers-mongoose-casl.md) and try to upload a file

