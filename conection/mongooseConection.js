const mongoose = require("mongoose");
require("dotenv");
var urlConection = "mongodb+srv://PIDtest:bRKRZOVwM6ohLUBs@clusterpid0.zeust4v.mongodb.net/Banktest"
                   
mongoose.connect(urlConection,{useNewUrlParser: true})
              .then(() => { console.log('Conectado a mongoose') }, err => { console.log(err) })


module.exports = mongoose;