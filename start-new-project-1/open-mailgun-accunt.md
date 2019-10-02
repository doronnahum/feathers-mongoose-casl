---
description: We need mail service to verify user email
---

# Email service

{% hint style="info" %}
You can skip this step if you did not need a verification email in your app

How to disabled email verify?  
1 - open config\default.json  
2- Set false at verifyEmail.enabled
{% endhint %}

### 

{% hint style="warning" %}
If you are using **mailgun without domain** you need to verify the emails you want to email Please add your email where you'd like to sign in to your app[https://app.mailgun.com/app/account/authorized](https://app.mailgun.com/app/account/authorized)
{% endhint %}

### Send emails using mailgun

1. **Create** [**mailgun**](https://app.mailgun.com/sessions/new) **account**
2. **Update config file**

   {% code-tabs %}
   {% code-tabs-item title="/config/default.json" %}
   ```javascript
   // Add this lines
     "mailgun": {
       "apiKey": "key-XXX",
       "domain": "XX.com"
     }
  
   "feathers-mongoose-casl": {
       "mailer": {
         "service": "mailgun",
       },
   ```
   {% endcode-tabs-item %}
   {% endcode-tabs %}

### Send emails using sendgrid

1. **Create** [**s**engrid ](https://signup.sendgrid.com/)**account**
2. **Update config file**

   {% code-tabs %}
   {% code-tabs-item title="/config/default.json" %}
   ```javascript
   // Update add this lines
     "sendgrid": {
       "apiKey": "key-XXX",
     }
  
   "feathers-mongoose-casl": {
       "mailer": {
         "service": "sendgrid",
          //Optional - un comment to use template
          //"sendgrid-authentication-emails-templates": {
           //"reset-password": "d-e3565301c97748e199cf07987cfac6bd",
           //"Identity-change": "d-e89c652f1b6a41b4b65ffd8f81a89506",
           //"password-change": "d-e89c652f1b6a41b4b65ffd8f81a89506",
           //"verify-email": "d-2b7c56d513cc4401adfd6475cbc9352e",
           //"password-was-reset": "d-e89c652f1b6a41b4b65ffd8f81a89506",
           //"email-verified": "d-67c7921e8bcc4447a7ae593878a6f0ab"
         //}
       }
   ```
   {% endcode-tabs-item %}
   {% endcode-tabs %}

```text
git add .
git commit -m "Update mailgun apiKey"
```

