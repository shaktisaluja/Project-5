const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: {type:String, required:true,unique:true,trim:true},
    description: {type:String, required:true,trim:true},
    price: {type:Number, required:true,trim:true},
    currencyId: {type:String, required:true,trim:true},//INR 
    currencyFormat: {type:String, required:true,trim:true},//Rupee smbol
    isFreeShipping: {type:Boolean, default: false,trim:true},
    productImage: {type:String, required:true,trim:true},  // s3 link
    style: {type:String,trim:true},
    //availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
    installments: {type:Number},
    deletedAt: {type:Date},
    isDeleted: {type:Boolean, default: false},
    
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)