
### "versions": "1.8.7"
fix audit and remove Unused dependencies
### "versions": "1.8.6"
fix issue with '$select'
### "versions": "1.8.5"
callingParamsPersistUser is now get params at the first attribute and not hook object
in this way we can persist the user from other-service.class.js 
### "versions": "1.8.4"
fix issue "Cannot read property 'USER_PROTECTED_FIELDS' of undefined"
### "version": "1.8.3"
--------------------------------------------------------------------------
1. add to config 2 new keys:
   1. "fetchMeOnLogin": [boolean] [default-false] - set true if you want to fetch user from '/me' and not from params.user, helpful when you do something special on '/me' like populate
   2. "usersServiceOptions": [object] [default-null] - pass object to add options to users.options- like {whitelist: '$populate'}

2. removed the me hook and filter the fields on the me class
3. clean code and fix issue 'abilityFields is not iterable'

### "version": "1.8.2"
--------------------------------------------------------------------------
1. uploadMiddleware - is now support fileFilter, just add mimetypes[array] when using uploadMiddleware
```jsx
uploadMiddleware({
      app,
      fileKeyName: FILE_KEY_NAME,
      serviceName: 'files',
      storageService: app.get('feathers-mongoose-casl').uploads.defaultFileService || STORAGE_TYPES['local-private'],
      publicAcl: false,
      mimetypes: ['image/png','image/jpeg', 'application/pdf']
    })
```

### "version": "1.8.1"
--------------------------------------------------------------------------
1. remove cookie support  getTokenFromCookie for docs ang get file