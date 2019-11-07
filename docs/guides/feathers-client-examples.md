# feathers Client examples

### Playground

[![Edit feathersjs-mongoose-client-playground-login](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y37xwvm2lv?view=editor)

### First- init the app

```javascript
const axios = require("axios");const app = feathers();const restClient = rest("http://localhost:3030");app.configure(restClient.axios(axios));// Available options are listed in the "Options" sectionapp.configure(  auth({    header: "Authorization", // the default authorization header for REST    prefix: "", // if set will add a prefix to the header value. for example if prefix was 'JWT' then the header would be 'Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOi...'    path: "/authentication", // the server-side authentication service path    jwtStrategy: "jwt", // the name of the JWT authentication strategy    entity: "user", // the entity you are authenticating (ie. a users)    service: "users", // the service to look up the entity    cookie: "feathers-jwt", // the name of the cookie to parse the JWT from when cookies are enabled server side    storageKey: "feathers-jwt", // the key to store the accessToken in localstorage or AsyncStorage on React Native    storage: cookieStorage // Passing a WebStorage-compatible object to enable automatic storage on the client.  }));
```

### Examples

```javascript
  onLogin({ values, setSubmitting }) {    // Login    app      .authenticate(values)      .then(res => {        this.setState({ token: res.accessToken, loginErr: null });        setSubmitting(false);      })      .catch(err => {        alert(err.message);        this.setState({ loginErr: err.message });      });  }  onSignup({ values, setSubmitting }) {    // Login    app      .service("users")      .create(values)      .then(res => {        if (res.verifiedRequired && !res.isVerified) {          setSubmitting(false);          alert("Verify your email from tyou inbox");        } else {          this.setState({ token: res.accessToken, loginErr: null });          setSubmitting(false);          this.onFindMe();        }      })      .catch(err => {        alert(err.message);        this.setState({ loginErr: err.message });      });  }  onFindMe() {    app      .service("me")      .find()      .then(res => {        this.setState({ me: res, meErr: null });      })      .catch(err => {        alert(err.message);        this.setState({ meErr: err.message });      });  }  onFetchPosts() {    app      .service("posts")      .find()      .then(res => {        this.setState({ posts: res.data, postsErr: null });      })      .catch(err => {        alert(err.message);        this.setState({ postsErr: err.message });      });  }  onNewPost({ values }) {    app      .service("posts")      .create(values)      .then(res => {        this.onFetchPosts();      })      .catch(err => {        alert(err.message);        this.setState({ postsErr: err.message });      });  }  onDelete(id) {    app      .service("posts")      .remove(id)      .then(res => {        this.onFetchPosts();      })      .catch(err => {        alert(err.message);        this.setState({ postsErr: err.message });      });  }  onLogout() {    app.logout().then(item => {      this.setState({        token: null,        loginErr: null,        me: null,        meErr: null,        posts: null,        postsErr: null      });    });  }
```

  


