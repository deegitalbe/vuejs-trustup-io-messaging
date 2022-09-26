## Installation

```shell
npm install @deegital/vuejs-trustup-io-messaging
```

### .env configuration

Add these information to your `.env` file **BEFORE** building the app.
```dotenv
MIX_MESSAGING_TRUSTUP_API_URL=
MIX_TRUSTUP_AUTH_API_URL=
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
Add this lines inside your `resources/bootstrap.js` file (or any file representing your js entrypoint for the project)
```js
require('@deegital/vuejs-trustup-io-messaging/scripts/bootstrap');
```

## Getting Started

To use this package inside a non-vuejs project :
```js
// resources/app.js
import Vue from 'vue'
import TrustupConversation from "@deegital/vuejs-trustup-io-messaging"

Vue.component('TrustupConversation', TrustupConversation)
new Vue({el: '#app'})
```

In a vuejs project, just import the component
```js
// yourfile.vue
import TrustupConversation from "@deegital/vuejs-trustup-io-messaging"

export default {
    // ...
    
    components: { TrustupConversation }
    
    // ...
}
```

## Usage
```html
<trustup-conversation
    app-key="example"
    model-type="conversation"
    :model-id="1"
    :user-id="1"
/>
```