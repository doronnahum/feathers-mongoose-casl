# Google-cloud

### Upload file to google-cloud 

###  1- Finish this guide

{% page-ref page="../create-upload-service.md" %}

### 

### 2- Create google-cloud account

1. Follow this 3 first steps of this [guide](%20https://medium.com/@iwozzy/easily-host-images-with-node-and-google-cloud-storage-29fb14e2cdb8)
2. Create secret-files folder  in the src folder
3. copy the JSON key  file from google-cloud to src &gt; secret-files and rename the file to secret-files.json

### 

### 3 - new bucket

1.  Create new bucket  


   ![](../../../.gitbook/assets/google-cloud-bucket%20%281%29.jpg)

### 

### 4- Update config json

**path**: config &gt; default.json  


1. Update projectId ****and bucket name  


   ```javascript
   "google-cloud": {
       "projectId": "THIS IS THE PROJECT NAME",
       "bucket": "THE BOCKET NAME",
       "keyFilename": "../src/secret-files/google-key.json",
       "signedUrlExpires" : 900
     },
   ```

2. Allow google-cloud  


   ```javascript
     "feathers-mongoose-casl": {
       "uploads": {
         "services": {
           "s3": false,
           "local-private": true,
           "local-public": true,
           "google-cloud": true // This need to be true
         }
         ....
   ```

\*\*\*\*

### **5- Update upload middleware configuration**

**path:** src &gt; services &gt; \[YOUR\_SERVICE\_NAME\] &gt; \[YOUR\_SERVICE\_NAME\].service.js

```javascript
  app.use('/organizations-files',
    uploadMiddleware({
      app,
      fileKeyName: 'file',
      serviceName: 'YOUR_SERVICE_NAME',
      storageService: STORAGE_TYPES['google-cloud'], // That's the change we made
      publicAcl: false,
      // mimetypes: ['image/png','image/jpeg'] // optional
    }),
    createService(options)
  );
```



### 6- Update service validators

**path**: src &gt; validators &gt;  \[YOUR\_SERVICE\_NAME\].validators.js

```javascript
const {Joi, enums} = require('feathers-mongoose-casl');

const getJoiObject = function(withRequired) {
  const required = withRequired ? 'required' : 'optional';
    return Joi.object({
    storage: Joi.string().valid(
      enums.STORAGE_TYPES['google-cloud'], //We need to add this line
      enums.STORAGE_TYPES['others'], // When user pass link to file
      ).meta({ dashboard: { hide: 1 }})
    ...
    })
}
```

#### 

### 7- Update service hooks

**path:** src &gt; services &gt; \[YOUR\_SERVICE\_NAME\] &gt; \[YOUR\_SERVICE\_NAME\].hooks.js

```javascript
const {hooks} = require('feathers-mongoose-casl');
const {uploadsHooks} = hooks;

const uploadHookConfig = {
  serviceName: 'YOUR_SERVICE_NAME',
  fileKeyName: 'file',
  singUrlKeyName: 'file',
  privateFile: true,
  autoSignUrl: true,
  userKeyName: 'user'
};


module.exports = {
  before: {
    all: [uploadsHooks(uploadHookConfig)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [uploadsHooks(uploadHookConfig)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
}
```

### 8 - Done!

test the service

test from dashboard :  
1\) open [feathersjs-mongoose-casl-admin](../../../start-new-project-1/install-feathers-mongoose-casl.md) and try to upload a file

