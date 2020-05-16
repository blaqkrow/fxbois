const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios')
const base64 = require('base-64');
const fetch = require('node-fetch')
const firebase = require('firebase')
var rp = require('request-promise');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

firebase.initializeApp({
    projectId: "fxbois-razer"
})

admin.initializeApp({
    //databaseURL: "http://localhost:5678"
    
})

    

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
    const monthlyRepayment = (loanAmt + actualIntr)/data.tenor
    return newDoc.set({
        tenor:parseInt(data.tenor),
        amt: loanAmt,
        interest: intr,
        borrower:'',
        lender:'',
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
    let toploans = loansRef.where('tenor', '<=', parseInt(data.tenorSelected))
    toploans.get()
    .then(snapshot => {
        console.log(snapshot)
        return snapshot.docs        
    })
    .catch(err => {return err})
 })



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
