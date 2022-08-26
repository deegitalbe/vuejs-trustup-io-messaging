import Conversation from "./src/vue/conversation";

import Hermite_class from "./src/vendors/hermite"
window.EXIF = require('exif-js');
window.HERMITE = new Hermite_class()

import Toasteo from "toasteo";
window.Toasteo = new Toasteo({});

const messagingTailwindPath = './node_modules/@deegital/vuejs-trustup-io-messaging/**/*.vue'

export default Conversation;
export {messagingTailwindPath}