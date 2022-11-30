## Installation

```shell
yarn add @deegital/vuejs-trustup-io-messaging
```

### .env configuration

Add these information to your `.env`.
Replace {YOUR-COMPILER} by **VITE** or **MIX** depending on your project compiler.

```dotenv
{YOUR-COMPILER}_MESSAGING_TRUSTUP_API_URL=
{YOUR-COMPILER}_TRUSTUP_AUTH_API_URL=
{YOUR-COMPILER}_TRUSTUP_SERVER_AUTHORIZATION=
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

## Getting Started

To use this package inside a non-vuejs project :
```js
// resources/app.js
import Vue from 'vue';
import { TrustupMessagingConversation } from "@deegital/vuejs-trustup-io-messaging";

Vue.component('TrustupMessagingConversation', TrustupMessagingConversation);
new Vue({el: '#app'});
```

In a vuejs project, just import the component
```js
// yourfile.vue
import { TrustupMessagingConversation } from "@deegital/vuejs-trustup-io-messaging";

export default {
    // ...
    
    components: { TrustupMessagingConversation }
    
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