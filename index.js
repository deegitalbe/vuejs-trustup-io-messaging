import Conversation from "./src/vue/conversation.vue";
import EXIF from "exif-js";

import Hermite_class from "./src/vendors/hermite"
window.EXIF = EXIF;
window.HERMITE = new Hermite_class()

import Toasteo from "toasteo";
window.Toasteo = new Toasteo({});

export { Conversation as TrustupMessagingConversation };
export default Conversation;