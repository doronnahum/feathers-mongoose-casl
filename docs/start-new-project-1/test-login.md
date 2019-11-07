# Test Login

## In this step we are going to login your first user

You can You can login from  
dashboard [https://feathersjs-mongoose-casl-admin.herokuapp.com/](https://feathersjs-mongoose-casl-admin.herokuapp.com/) swagger [http://localhost:3030/docs](http://localhost:3030/docs)  
postman [feathers-mongoose-casl postman documentation](https://documenter.getpostman.com/view/1210930/S11RJv5r)

{% api-method method="post" host="http://localhost:3030/authentication \\" path="" %}
{% api-method-summary %}

{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-body-parameters %}
{% api-method-parameter name="password" type="string" required=true %}
password1324
{% endapi-method-parameter %}

{% api-method-parameter name="email" type="string" required=true %}
myEmail@gmail.com
{% endapi-method-parameter %}

{% api-method-parameter name="strategy" type="string" required=true %}
local
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI1YzVhY2MzNzZmMzJhZTNiMDhlNTBhN2EiLCJpYXQiOjE1NDk0NTQ4MzcsImV4cCI6MTU0OTU0MTIzNywiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiZTI4NTcyNDUtZWMzZi00YzhlLWFiZmUtNzhiMzJhYjlhOGRmIn0.LfSttwrbpjD15bmf9xFtBkid2FcpRJM2YFO6yvosuXI",    "user": {        "_id": "5c5acc376f32ae3b08e50a7a",        "email": "MyEmail@gmail.com",        "updatedAt": "2019-02-06T12:00:18.441Z",        "createdAt": "2019-02-06T11:59:51.471Z",        "__v": 0    }}
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=400 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```text
{    "name": "BadRequest",    "message": "User's email is not yet verified.",    "code": 400,    "className": "bad-request",    "errors": {}}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Postman snippet

```text
curl -X POST \  http://localhost:3030/authentication \  -H 'Content-Type: application/x-www-form-urlencoded' \  -H 'Postman-Token: eccaf293-a50e-48ec-a53e-aebc241defba' \  -H 'cache-control: no-cache' \  -d 'email=doron.nahum%2B11%40gmail.com&password=password&strategy=local&undefined='
```

{% hint style="danger" %}
If you didn't verify your email, the login will fail

## Verify email:

In your inbox you can find mail to verify the email.

the mail come from yourCompanyEmail@gmail.com  
you can edit this email from config file, and you can custom the email from src/email-templates/account/verify-email.pug

![](../../.gitbook/assets/screen-shot-2019-03-09-at-22.28.59.png)
{% endhint %}

