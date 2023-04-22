const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    quantity:Number,
    userName: String,
    operation: {type:String, required:false}
});

const BankAccount = mongoose.model('BankAccount', accountSchema);

module.exports = BankAccount;