var request = require('request');

class Blockchain {
  constructor() {
    let secretDictonary = {
      '0' : '21a101fe22',
      '1' : 'be5957d286',
      '2' : '1633aba9d1',
      '3' : '80cb22775d',
      '4' : '9560b07d04',
    }
  }

  authChain(userID) {
    var Secret =  {
      enrollId: "user_type1_"+userID,
      enrollSecret: secretDictonary[userID]
    };

    var url = "https://76e1ecefd9374cdcb077294e31024b08-vp"+userID+".us.blockchain.ibm.com:5003/registrar"
    var options = {
      method: 'post',
      body: Secret,
      json: true,
      url: url
    }
    request(options, function(err, res) {
      console.log(res, "REPLY")
      console.log(err, "ERROR")
    });
  }

  writeChain(userID, params, callback) {
    var Secret = {
        jsonrpc: "2.0",
        method: "invoke",
        params: {
            type: 1,
            chaincodeID: {
                name: "36d17c96d8a730783b7545709fd3afbfcd8d2239d2f7b69555dc9877605063061f328be52b4db5bd126057a992f6de5e240e4ffda4b34d8cc98aa2eaa993fe6a"
            },
            ctorMsg: {
                function : "write",
                args: params
            },
            secureContext: "user_type1_"+userID
        },
        id: 0
    }

    var url = "https://76e1ecefd9374cdcb077294e31024b08-vp"+userID+".us.blockchain.ibm.com:5003/chaincode"

    var options = {
      method: 'post',
      body: Secret,
      json: true,
      url: url
    }
    request(options, function(err, res) {
      if (err) {
        console.log(err)
        return;
      }
      console.log("\nSuccessfully Wrote To Ledger: ")
      callback(res.body.result.message);
    });
  }

  readChain(userID, hashValue, callback) {
    var Secret = {
        jsonrpc: "2.0",
        method: "query",
        params: {
            type: 1,
            chaincodeID: {
                name: "36d17c96d8a730783b7545709fd3afbfcd8d2239d2f7b69555dc9877605063061f328be52b4db5bd126057a992f6de5e240e4ffda4b34d8cc98aa2eaa993fe6a"
            },
            ctorMsg: {
                function : "read",
                args: [
                    hashValue
                ]
            },
            secureContext: "user_type1_"+userID
        },
        id: 2
    }

    var url = "https://76e1ecefd9374cdcb077294e31024b08-vp"+userID+".us.blockchain.ibm.com:5003/chaincode"

    var options = {
      method: 'post',
      body: Secret,
      json: true,
      url: url
    }
    request(options, function(err, res) {
      if (err) {
        console.log(err)
        return;
      }
      console.log("\nSuccessfully Queried Ledger: ")
      callback(res.body.result.message);
    });
  }
}

module.exports = Blockchain
