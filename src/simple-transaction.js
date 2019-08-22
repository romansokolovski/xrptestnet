//Simple transaction on XRP test net


'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

var newTx;
var maxLv;

const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233' // Ripple testnet
});
api.connect().then(() =>{
    // Continuing after connecting to the API
    async function doPrepare() {
        const sender = "rax8ZG5tfe3iWkg2wV5qai8Ncrp7HhPri3"
        const preparedTx = await api.prepareTransaction({
            "TransactionType": "Payment",
            "Account": sender,
            "Amount": api.xrpToDrops("23"), // Same as "Amount": "22000000"
            "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
        }, {
            // Expire this transaction if it doesn't execute within ~5 minutes:
            "maxLedgerVersionOffset": 75
        })
        const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
        maxLv = maxLedgerVersion
        console.log("Prepared transaction instructions:", preparedTx.txJSON)
        console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
        console.log("Transaction expires after ledger:", maxLedgerVersion)
        return preparedTx.txJSON
    }

    var txJSON = doPrepare();
    return txJSON;

} ).then(txJSON=>{
    // Grab txJSON from previous step
    const response = api.sign(txJSON, "shQBTUeR39GeqqMjeRU78cGAv1sEA")
    const txID = response.id
    newTx = txID
    console.log("Identifying hash:", txID)
    const txBlob = response.signedTransaction
    console.log("Signed blob:", txBlob)
    return txBlob

}).then(txBlob=>{
    // use txBlob from the previous example
    async function doSubmit(txBlob) {
        const latestLedgerVersion = await api.getLedgerVersion()

        const result = await api.submit(txBlob)

        console.log("Tentative result code:", result.resultCode)
        console.log("Tentative result message:", result.resultMessage)

        // Return the earliest ledger index this transaction could appear in
        // as a result of this submission, which is the first one after the
        // validated ledger at time of submission.
        return latestLedgerVersion + 1
    }
    const earliestLedgerVersion = doSubmit(txBlob)
    return earliestLedgerVersion
}).then(eLV=>{
    // earliestLedgerVersion was noted when the transaction was submitted.
    // txID was noted when the transaction was signed.

    async function func() {
        try {
            var tx;
            tx = await api.getTransaction(newTx, {minLedgerVersion: eLV})
            console.log("Transaction result:", tx.outcome.result)
            console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges))
        } catch(error) {
            console.log("Couldn't get transaction outcome:", error)
        }

    }
}).then(()=>{
    const myAddress = 'rax8ZG5tfe3iWkg2wV5qai8Ncrp7HhPri3';

    console.log('getting my account info for', myAddress);
    return api.getAccountInfo(myAddress);
}).then(info => {
    console.log(info);
}).then(()=>{
    const destAddress = 'rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM'
    console.log('getting destination account info for', destAddress);
    return api.getAccountInfo(destAddress);
}).then(info => {
    console.log(info);
    console.log('getAccountInfo done');
}).then(() => {
    return api.disconnect();
}).then(() => {
    console.log('done and disconnected.');
}).catch(console.error);