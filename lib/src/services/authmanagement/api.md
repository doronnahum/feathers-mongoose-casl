## resendVerifySignup
url: "http://localhost:3030/authManagement"
method: post,
body: {
   "action": "resendVerifySignup",
   "value": {"email": "userEaail@gmail.com"}
}

## checkUnique
url: "http://localhost:3030/checkUnique"
method: post,
body: {
   "action": "resendVerifySignup",
   "value": {"email": "userEaail@gmail.com"}
}
return 200 only if is Unique email

## verifySignupLong
url: "http://localhost:3030/verifySignupLong"
method: post,
body: {
   action: "verifySignupLong"
   value: "281813b93785a68e7590833bed58e5"
}
return 200 only if is Unique email

## passwordChange
url: "http://localhost:3030/authManagement"
method: post,
{
      "action": "passwordChange",
      "value": {
        "user": {
          "email": "userEmail@gmail.com"
        },
        "oldPassword": "password",
        "password": "1234578"
      }
}

## sendResetPwd
url: "http://localhost:3030/authManagement"
method: post,
{
   "action": "sendResetPwd",
   "value": {"email": "userEmail@gmail.com"}
}

## sendResetPwd
url: "http://localhost:3030/authManagement"
method: post,
{
   "action": "resetPwdLong",
   "value": {
      "password": "123",
      "token": "5c48568a1c1b3bacd1c15e6b___5c62ea2d39a1e013009cccbaf63311"}
}