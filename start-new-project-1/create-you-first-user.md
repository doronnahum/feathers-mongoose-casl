# Create you first user

### In this step we are going to register your first user

You can register from  
dashboard  [https://feathersjs-mongoose-casl-admin.herokuapp.com/](https://feathersjs-mongoose-casl-admin.herokuapp.com/)  swagger [http://localhost:3030/docs](http://localhost:3030/docs)  
postman

### [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/648e29eb55b4a26be732)

{% embed url="https://documenter.getpostman.com/view/1210930/S1ZxapVe?version=latest" %}

### 

### Run your server

```text
npm run dev
```

{% api-method method="post" host="http://localhost:3030/users" path="" %}
{% api-method-summary %}
Create user
{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-body-parameters %}
{% api-method-parameter name="password" type="string" required=true %}
password1234
{% endapi-method-parameter %}

{% api-method-parameter name="email" type="string" required=true %}
MyEmail@gmail.com
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```javascript
{
createdAt: "2019-03-07T08:52:32.429Z"
email: "MyEmail@gmail.com"
isVerified: false
roles: []
updatedAt: "2019-03-07T08:52:32.429Z"
verifiedRequired: true
__v: 0
_id: "5c80dbd0e3c6b10ad0375457"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

### Postman snippet

```text
curl -X POST \
  http://localhost:3030/users \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 5ad6571f-e2dd-4737-b0e5-73d2fe8986fe' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "yourEmail@gmail.com",
	"password": "password"
}'
```

### Response

```text
{
    "roles": [],
    "_id": "5c84204c1fa2991670286a70",
    "email": "doron.nahum@gmail.com",
    "isVerified": false,
    "updatedAt": "2019-03-09T20:21:32.784Z",
    "createdAt": "2019-03-09T20:21:32.784Z",
    "__v": 0,
    "verifiedRequired": true
}
```

### verifiedRequired is true, you can't login to app yet, if you try to login the server will return error with message: "User's email is not yet verified."

### You can try to login to dashboard:

### [mongoose-casl-admin](install-feathers-mongoose-casl.md)

{% hint style="danger" %}
### **Didn't receive any email?**

* Check the spam folder

If you are using mail service without a domain, you need to add you email at mailgun/sendgrid to the whitelist  


if you use a free **mailgun** account then you need to verify the emails you want to email Please add your email where you'd like to sign in to your app [https://app.mailgun.com/app/account/authorized](https://app.mailgun.com/app/account/authorized)  
  
1- verify that you update a valid mailgun/sendgrid key in the config\default.json  
2- verify that you update the feathers-mongoose-casl.mailer.service to 'sendgrid' or 'mailgun' in the config\default.json  
3- verify that you update a vaild verifyEmail.fromEmail in config\default.json  
4- you can see debug logs by updating logger level to  'debug at, src\logger.js

 
{% endhint %}

### Want to resend the email?

#### Postman snippet

```text
curl -X POST \
  http://localhost:3030/authManagement \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 6f647968-5e41-45a1-8b82-d8ad42dabcda' \
  -H 'cache-control: no-cache' \
  -d '{
   "action": "resendVerifySignup",
   "value": {"email": "YOUR_EMAIL@Gmail.com"}
}'
```

