# Update config

### Open config\default.json and add the lines from the code snippet. 

 snippet has 2 files, one with comments and one without comments, copy the clean one

{% tabs %}
{% tab title="WITH-COMMENTS" %}
```javascript
{
  // Add this to your config file
  "serverUrl": "http://localhost:3030",
  "public": "../public/",
  "feathers-mongoose-casl": {
    "pickMeReadFields": [],
    /* Array of field that user can see ['email'] or can't see ['-verifyEmail']*/
    "pickMeUpdateFields": [] /* Array of field that user can update ['email'] or can't update ['-verifyEmail']*/ ,
    "usersServiceOptions": null, //optional, to allow {whitelist: '$populate'} for example
    "defaultRules": [ /* Array of default rules to your app */ {
        "userContext": {
          "email": "YOUR_EMAIL_HERE"
        },
        "actions": ["manage"],
        "subject": ["dashboard", "users", "user-abilities", "rules", "files"]
      },
      {
        "name": "allow-admin-dashboard",
        "description": "allowed admin users access dashboard, and manage rules and users",
        "actions": ["manage"],
        "subject": ["dashboard", "users", "get-file"],
        "roles": ["admin"]
      },
      {
        "name": "allow-sys-admin-rules",
        "description": "allowed admin users access dashboard, and manage rules and users",
        "actions": ["manage"],
        "subject": ["rules", "user-abilities"],
        "roles": ["sys-admin"]
      }
    ],
    "uploads": {
      "services": {
        /* Uploads services to allow */
        "s3": false,
        "local-private": true,
        "local-public": true,
        "google-cloud": false
      },
      "defaultFileService": "local-private",
      /* The service to use in the built in File service*/
      "blockDeleteDocumentWhenDeleteFileFailed": false,
      /* Set true if you want to block DB document delete if assign file deleting is failed */
      "blockUpdateDocumentWhenReplaceFileFailed": false /* Set true if you want to block DB document updating if assign file deleting is failed */
    },
    "verifyEmail": {
      "enabled": true,
      /* Set to false if you want to let the user login withot validate is emails */
      "fromEmail": "info@MyCompany.com",
      "helpEmail": "help@MyCompany.com"
    },
    "clientUrl": "http://localhost:8080",
    "changePasswordClientUrl": null,
    "clientSigninUrl": "http://localhost:8080/signin",
    /* The url to redirect after email is verified*/
    "srcFolder": "../src/",
    "privateFolder": "../private-files",
    /* The place to save private-files when you use upload local-private*/
    "rulesCache": {
      "enabled": true,
      /* true is recommended, we save rules in the cache and we refresh the cache when DB rules are updating */
      "local-config": {
        "max": 400,
        "maxAge": 3600000
      }
    },
    "privateFilesAbilityCache": {
      "enabled": true,
      /* true is recommended, we save user abilities to see the private file in the cache */
      "local-config": {
        "max": 100,
        "maxAge": 3600000
      }
    }
  }
}
```
{% endtab %}

{% tab title=" config\\default.json" %}
```
{
  // Add this to your config file,
  "serverUrl": "http://localhost:3030",
  "mongodb": "mongodb+srv.....",
  "feathers-mongoose-casl": {
    "pickMeReadFields": ["-roles", "-verifyExpires", "-resetExpires", "-verifyToken", "-isVerified", "-resetToken", "-verifyChanges", "-password"],
    "pickMeUpdateFields": ["firstName", "lastName"],
    "usersServiceOptions": null,
    "defaultRules": [{
        "userContext": {
          "email": "YOUR_EMAIL_HERE"
        },
        "actions": ["manage"],
        "subject": ["dashboard", "users", "user-abilities", "rules", "files"]
      },
      {
        "name": "allow-admin-dashboard",
        "description": "allowed admin users access dashboard, and manage rules and users",
        "actions": ["manage"],
        "subject": ["dashboard", "users", "get-file"],
        "roles": ["admin"]
      },
      {
        "name": "allow-sys-admin-rules",
        "description": "allowed admin users access dashboard, and manage rules and users",
        "actions": ["manage"],
        "subject": ["rules", "user-abilities"],
        "roles": ["sys-admin"]
      }
    ],
    "uploads": {
      "services": {
        "s3": 0,
        "local-private": 1,
        "local-public": 1,
        "google-cloud": 0
      },
      "defaultFileService": "local-private",
      "blockDeleteDocumentWhenDeleteFileFailed": false,
      "blockUpdateDocumentWhenReplaceFileFailed": false
    },
    "verifyEmail": {
      "enabled": true,
      "fromEmail": "info@MyCompany.com",
      "helpEmail": "help@MyCompany.com"
    },
    "clientUrl": "http://localhost:8080",
    "changePasswordClientUrl": null,
    "clientSigninUrl": "http://localhost:8080/signin",
    "srcFolder": "../src/",
    "privateFolder": "../private-files",
    "rulesCache": {
      "enabled": true,
      "local-config": {
        "max": 400,
        "maxAge": 3600000
      }
    },
    "privateFilesAbilityCache": {
      "enabled": true,
      "local-config": {
        "max": 100,
        "maxAge": 3600000
      }
    }
  }
}
```
{% endtab %}
{% endtabs %}

### copy the result and paste in the config file

```text
git add .
git commit -m "config\default.json"
```

### 

