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