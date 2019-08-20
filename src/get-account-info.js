'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233' // XRP Testnet
    //server: 'wss://s1.ripple.com' // Public rippled server
});
api.connect().then(() => {
    /* begin custom code ------------------------------------ */
    const myAddress = 'rax8ZG5tfe3iWkg2wV5qai8Ncrp7HhPri3';

console.log('getting account info for', myAddress);
return api.getAccountInfo(myAddress);

}).then(info => {
    console.log(info);
console.log('getAccountInfo done');

/* end custom code -------------------------------------- */
}).then(() => {
    return api.disconnect();
}).then(() => {
    console.log('done and disconnected.');
}).catch(console.error);
