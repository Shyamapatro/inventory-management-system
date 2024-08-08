const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    items:Array,
    totalAmount:Number,
    
},{timestamps : true});

module.exports = mongoose.model("transaction", transactionSchema);
