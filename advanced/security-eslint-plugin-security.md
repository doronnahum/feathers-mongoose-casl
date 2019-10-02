# Security - eslint-plugin-security

Add [eslint-plugin-security ](https://github.com/nodesecurity/eslint-plugin-security)to your project

#### Installation

`npm install --save-dev eslint-plugin-security`

#### Usage

Add the following to your `.eslintrc` file:

```text
"plugins": [
  "security"
],
"extends": [
  "plugin:security/recommended"
]
```

#### Add this to your scripts at the package.json

```javascript
  "scripts": {
    ...
    "lint": "./node_modules/.bin/eslint .",
    "cont-int": "npm test && npm run-script lint"
  },
```

#### Run this command and fix your es-lint errors

```bash
npm run cont-int
```

