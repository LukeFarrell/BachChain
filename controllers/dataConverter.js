var fs = require("fs");

class converter {
  constructor() {

  }
  encode(data){
    return data.toString("base64")
  }
  decode(fileName, base64string){
    var songData = new Buffer(base64string, 'base64');
    fs.write('fileName', songData)
    })
  }
}
