// Before running the code:
//    npm install rippled-ws-client rippled-ws-client-sign websocket
//add custom memo to transaction

const RippledWsClient = require('rippled-ws-client')
const RippledWsClientSign = require('rippled-ws-client-sign')

// Your secret
const SeedOrKeypair = 'sas4jrKFv34rhSVKVeMMrSwZ9VQjp'
// Your wallet (sending the funds)
const SendingWallet = 'rayjDLgZoCgx76oJw8WuEXmsgVu1ftvkQG'
// The destination wallet
const DestinationWallet = 'rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM'
// The amount of XRP to send
const AmountXRP = 23
// The note
const Note = 'admin@chargemail.com'

const Transaction = {
    TransactionType: 'Payment',
    Account: SendingWallet,
    Destination: DestinationWallet,
    Amount: AmountXRP * 1000000, // Amount in drops, so multiply (6 decimal positions)
    LastLedgerSequence: null,
    Fee: 12,
    Memos: [
        {
            Memo: {
                MemoType: Buffer.from('Note', 'utf8').toString('hex').toUpperCase(),
                MemoData: Buffer.from(Note, 'utf8').toString('hex').toUpperCase()
            }
        }
    ]
}

new RippledWsClient('wss://s.altnet.rippletest.net:51233').then((Connection) => {
    new RippledWsClientSign(Transaction, SeedOrKeypair, Connection).then((TransactionSuccess) => {
        console.log('TransactionSuccess', TransactionSuccess)
        Connection.close()
    }).catch((SignError) => {
        console.log('SignError', SignError.details)
        Connection.close()
    })
}).catch((ConnectionError) => {
    console.log('ConnectionError', ConnectionError)
})

