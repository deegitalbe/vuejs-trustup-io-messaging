## Installation

```shell
npm install @deegital/vuejs-trustup-io-messaging
```

### .env configuration

Add these information to your `.env` file **BEFORE** building the app.
```dotenv
MIX_MESSAGING_TRUSTUP_API_URL=
MIX_TUSTUP_API_URL=
MIX_TRUSTUP_SERVER_AUTHORIZATION=

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=
PUSHER_SCHEME=
PUSHER_APP_CLUSTER=

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_HOST="${PUSHER_HOST}"
MIX_PUSHER_PORT="${PUSHER_PORT}"
MIX_PUSHER_SCHEME="${PUSHER_SCHEME}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### Tailwind configuration for component build design
Add this line in your `tailwind.config.js` to tell Tailwind to build the package design when running.
```js

const messagingTailwindPath = require('@deegital/vuejs-trustup-io-messaging/tailwind')

module.exports = {
    content: [
        // ...
        messagingTailwindPath,
    ],
    
    // ...
```

### Configuration Pusher and Laravel Echo
Add these lines inside your `resources/bootstrap.js` file (that should be required inside your `resources/index.js`)
```js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    wsHost: process.env.MIX_PUSHER_HOST,
    wsPort: 443,
    wssPort: 443,
    disableStats: true,
});

```

## Getting Started

To use this package inside a non-vuejs project :
```js
// resources/app.js
import Vue from 'vue'
import Conversation from "@deegital/vuejs-trustup-io-messaging"

Vue.component('Conversation', Conversation)
new Vue({el: '#app'})
```

In a vuejs project, just import the component
```js
// yourfile.vue
import Conversation from "@deegital/vuejs-trustup-io-messaging"

export default {
    // ...
    
    components: {Conversation}
    
    // ...
}
```

## Usage
```html
<conversation :app_name="'exemple'"
              :model="'conversation'"
              :model_id="1"
              :user_id="1"></conversation>
```