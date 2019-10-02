# Add to your react app

### How to install dashboard in your client

#### 1. Install feathers-mongoose-casl-dashboard

```bash
    npm i feathers-mongoose-casl-dashboard --save
```

#### 2. Create new react screen 

```javascript
import React, { Component } from 'react';
import {DashboardApp} from 'feathers-mongoose-casl-dashboard';
import 'feathers-mongoose-casl-dashboard/lib/style.css'

class PostsAdminScreen extends Component {
  render() {
    return (
      <DashboardApp
        url={'posts'} // This can be value from url params to allow dynamic screen
      />
    );
  }
}

export default PostsAdminScreen;

```

### 3. Add all available services to your sidebar

```javascript
import React, { Component } from 'react';

import {
  DashboardMenu
} from 'src/localnode/feathers-mongoose-casl-dashboard';

import { getDeepObjectValue } from 'validate.js';


class SideBar extends Component {
  render() {
    return (
      <div>
        <DashboardMenu
          renderItem={item => {
            const icon = objDig(
              item,
              'data.dashboardConfig.sideBarIconName'
            );
            const serviceName = item.result.name;
            return (
              <button
                key={serviceName}
                link={`/app/dashboard?screen=${serviceName}`}
              >
                {serviceName}
              </button>
            );
          }}
        />
      </div>
    );
  }
}
```

