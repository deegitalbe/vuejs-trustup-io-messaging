import Conversation from "./src/vue/conversation.vue";

import Hermite_class from "./src/vendors/hermite"
window.EXIF = require('exif-js');
window.HERMITE = new Hermite_class()

import Toasteo from "toasteo";
window.Toasteo = new Toasteo({});

export { Conversation as TrustupMessagingConversation };
export default Conversation;