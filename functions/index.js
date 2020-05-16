const functions = require('firebase-functions');
const admin = require('firebase-admin');
const base64 = require('base-64');
const fetch = require('node-fetch')
var rp = require('request-promise');
const firebase = require('firebase')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

firebase.initializeApp({
    projectId: "fxbois-razer"
})

/*admin.initializeApp({
    //databaseURL: "http://localhost:5678"
    
})*/

    

exports.test = functions.https.onCall((data, context) => {
    console.log('Hello')
    return data
})

exports.insertloan = functions.https.onCall((data, context) => {
    const db = firebase.firestore()    
    let loansRef = db.collection('loans')
    let newDoc = loansRef.doc()
    const loanAmt = parseFloat(data.amt)
    const intr = parseFloat(data.interest.replace('%',''))
    const actualIntr = ((intr/100) * (parseFloat(data.tenor)/12)) * loanAmt
    const monthlyRepayment = parseFloat((loanAmt + actualIntr)/data.tenor)
    return newDoc.set({
        tenor:parseInt(data.tenor),
        amt: loanAmt,
        interest: intr,
        borrower:'',
        lender:data.lender,
        monthlyRepayment: monthlyRepayment,
        actualInterest: actualIntr
    }).then(saved => {
        return saved;
    }).catch(err => {
        return err
    });
 })

 exports.getTopLoans = functions.https.onCall((data, context) =>  {
    const db = firebase.firestore()
    let loansRef = db.collection('loans')
    let toploans = loansRef.where('tenor', '>=', parseInt(data.tenorSelected))
    return toploans.get()
    .then(snapshot => {
        let loansArr = []
        snapshot.forEach(doc =>{
            loansArr.push({lid: data.id, data: doc.data()})
            console.log(doc.data())
        })
        
        index = loansArr.length - 1;

        while (index >= 0) {
            if (loansArr[index].data.amt != parseInt(data.amt)) {
                loansArr.splice(index, 1);
            } else {
                delete loansArr[index].data.lender
                delete loansArr[index].data.borrower
            }

            index -= 1;
        }
        const sortedLoansArr = loansArr.slice().sort(loansCompare)
        return sortedLoansArr.slice(0,2) 
    })
    .catch(err => {return err})
 })

 function loansCompare(a, b) {
    if (a.actualInterest > b.actualInterest) return 1;
    if (b.actualInterest > a.actualInterest) return -1;
  
    return 0;
  }



function createCurrentAccount(encodedKey) {
    var inputJson = {}
    var savingsAccount = 'savingsAccount'
    var overdraftIntSettings = {
        "interestRate": "5"
    }
    var interestSettings = {
        "interestRate": "1.25"
    }
    inputJson[savingsAccount] = {
        "name": "Digital Account",
        "accountHolderType": "CLIENT",
        "accountHolderKey": encodedKey,
        "accountState": "APPROVED",
        "productTypeKey": "8a8e878471bf59cf0171bf6979700440",
        "accountType": "CURRENT_ACCOUNT",
        "currencyCode": "SGD",
        "allowOverdraft": "true",
        "overdraftLimit": "100",
        "overdraftInterestSettings": overdraftIntSettings,
        "interestSettings": interestSettings
    }

    return fetch('https://razerhackathon.sandbox.mambu.com/api/savings', {
        method: 'post',
        body:    JSON.stringify(inputJson),
        headers: {
            'Authorization' : 'Basic VGVhbTc6cGFzczEzMEFDRTE5Qzg=',
            'Content-Type': 'application/json' },
    })
    /* .then(res => res.json())
    .then(json => {
        console.log(json)
        return json
    }) */
}


 exports.registerMambu = functions.https.onCall((data, context) => {
    let dataSend = {        
        firstName: data.name,
        lastName: data.name,
        preferredLanguage: "ENGLISH",
        assignedBranchKey: "8a8e878e71c7a4d70171ca4ae85f108b",        
        idDocuments: [
            {
                identificationDocumentTemplateKey: "8a8e867271bd280c0171bf7e4ec71b01",
                issuingAuthority: "Immigration Authority of Singapore",
                documentType: "NRIC/Passport Number",
                validUntil: "2021-09-12",
                documentId: data.idNum
            }
        ],
        addresses: [],
    }

    const headers = {
        'Content-Type':'application/json',
        'Accept':'application/vnd.mambu.v2+json',
        'Authorization' : 'Basic ' + base64.encode('Team7' + ":" + 'pass130ACE19C8')
      };
      
    
      
      fetch('https://razerhackathon.sandbox.mambu.com/api/clients',
      {
        method: 'POST',
        body: JSON.stringify(dataSend),
        headers: headers
      })
      .then(res => {return res.json()})
      .then(body => {
        createCurrentAccount(body.encodedKey)
        .then(res => res.json())
        .then(bankAccount =>{
            console.log(bankAccount)
            const db = firebase.firestore()    
            let userDB = db.collection('users')
            const newUser = userDB.doc(body.id)
            return newUser.set({            
                firstName: body.firstName,
                lastName: body.lastName,
                uid: data.uid,
                mambuID: body.encodedKey,
                mambuBankAcc: bankAccount.savingsAccount.encodedKey
            }).then(user => {return user}) 
        }).catch(err => {console.log(err)})
               
        //console.log(body)        
          
      }).catch(err => {console.log(err)})


})
exports.kyc = functions.https.onCall((data, context) => {
    var options = {
        method: 'POST',
        uri: "https://niw1itg937.execute-api.ap-southeast-1.amazonaws.com/Prod/verify",
        body: {
            base64image: data.image
        },
        headers: {
            'Content-Type': 'application/json',
            'x-api-key' : 'jFgDThXeKFhusXOm2mXI'
        },
        json: true
    }
    console.log('Hello')
    console.log('options: ', options)
    return rp(options).then((body) => {
        console.log(body)
        return body
    })
})

exports.getBankAccountDetails = functions.https.onCall( async (data, context) =>{
    const db = firebase.firestore()
    let userRef = db.collection('users').doc(data)
    let user = await userRef.get()
    let acctId =  user.data().mambuBankAcc
    const headers = {
        'Accept':'application/vnd.mambu.v2+json',
        'Accept':'application/json',
        'Authorization' : 'Basic VGVhbTc6cGFzczEzMEFDRTE5Qzg='
      };
    var options = {
        uri: 'https://razerhackathon.sandbox.mambu.com/api/savings?accountHolderId=' + acctId + '&accountHolderType=CLIENT',
        headers: headers,
        json: true,
    }
    return rp(options).then((response) =>{
        return response;
    })

})

exports.depositMoneyIntoAcct = functions.https.onCall( async (data, context)=>{
    console.log(data)
    var sendJson = {
        "amount": data.amount,
        "notes": "Deposit into savings account",
        "type": "DEPOSIT",
        "method": "bank",
        "customInformation": [
            {
                "value": "unique identifier for receipt",
                "customFieldID": "IDENTIFIER_TRANSACTION_CHANNEL_I"
            }
        ]
    }

    const headers = {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Authorization' : 'Basic VGVhbTc6cGFzczEzMEFDRTE5Qzg='
      };
    
    return fetch('https://razerhackathon.sandbox.mambu.com/api/savings/' + data.accountId + '/transactions',
      {
        method: 'POST',
        body: JSON.stringify(sendJson),
        headers: headers
      })
      .then(res => {return res.json()})
      .then(body => {
          var result = {
              transactionId: body['transactionId'],
              balance: body['balance'],
          }
          return result})
})

exports.transferMoneyToAnotherAcct = functions.https.onCall((data,context) =>{
    var sendJson = {
        "type": "TRANSFER",
        "amount": data.amount,
        "notes": "Transfer to Expenses Account",
        "toSavingsAccount": data.recvAcctId,
        "method" :"bank"
    }

    const headers = {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Authorization' : 'Basic VGVhbTc6cGFzczEzMEFDRTE5Qzg='
      };
    
    return fetch('https://razerhackathon.sandbox.mambu.com/api/savings/' + data.sendAcctId + '/transactions',
      {
        method: 'POST',
        body: JSON.stringify(sendJson),
        headers: headers
      })
      .then(res => {return res.json()})
      .then(body => {
          var result = {
              transactionId: body['transactionId'],
              balance: body['balance'],
              currencyCode: body['currencyCode']
          }
          return result})

})
