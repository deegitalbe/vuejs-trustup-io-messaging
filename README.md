## Installation
```shell
npm install @deegital/vuejs-trustup-io-messaging
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