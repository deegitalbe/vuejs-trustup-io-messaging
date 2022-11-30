## Installation

```shell
yarn add @deegital/vuejs-trustup-io-messaging
```

### Environment configuration

Replace {YOUR-COMPILER} by **VITE** or **MIX** depending on your project compiler.

```dotenv
{YOUR-COMPILER}_MESSAGING_TRUSTUP_API_URL=
{YOUR-COMPILER}_TRUSTUP_AUTH_API_URL=
{YOUR-COMPILER}_TRUSTUP_SERVER_AUTHORIZATION=
```

### Tailwind configuration
Add this line in your `tailwind.config.js` to tell Tailwind to build package required classes.
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

### With vue configured
```js
// yourfile.vue
import { TrustupMessagingConversation } from "@deegital/vuejs-trustup-io-messaging";

export default {
    // ...
    
    components: { TrustupMessagingConversation }
    
    // ...
}
```

### Without vue configured
To use this package inside a non-vuejs project :
```js
// resources/app.js
import Vue from 'vue';
import { TrustupMessagingConversation } from "@deegital/vuejs-trustup-io-messaging";

Vue.component('TrustupMessagingConversation', TrustupMessagingConversation);
new Vue({el: '#app'});
```

## Usage
```html
<trustup-messaging-conversation
    app-key="example"
    model-type="conversation"
    :model-id="1"
    :user-id="1"
/>
```