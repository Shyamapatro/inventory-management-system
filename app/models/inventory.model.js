const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true,
        
    },
    quantity: {
        type: Number,
        
    },
    price: {
        type: Number,
        required: true,
        },
    category: {
        type: String,
        required: true
    },
    imageUrl:{
        type: String,  
    }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
