# feathers-logger

Install and add feathers-logger



1 - Install the module with: 

`npm install feathers-logger --save`

`2 - Add feathers-logger to`src/app.js

```javascript
var appLogger = require('feathers-logger');// ADD THIS AFTER app.configure(configuration());// logger - app.error(), app.log(), app.info(), app.warn()app.configure(appLogger());
```

