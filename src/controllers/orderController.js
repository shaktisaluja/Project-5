const cartModel = require("../models/cartModel")
const orderModel=require("../models/orderModel")
const productModel = require("../models/productModel")
const { userModel } = require("../Models/userModel")
const { isValidBody, isValidObjectId, isInteger } = require("../utilities/validation");


const createOrder=async function(req,res){
    try{
let userId=req.params.userId
if (!isValidObjectId(userId)) {
    return res.status(400).send({ status: false, message: "User Id is Not Valid" });
}
// if (!isValidBody(req.body)) {
//     return res.status(400).send({ status: false, message: "Field can't not be empty.Please enter some details" });
// }
let findCart = await cartModel.findOne({ userId: userId }).select({_id:0,createdAt:0,updatedAt:0,__v:0}).lean()
let totalQuantity=findCart.items.map(x => x.quantity).reduce((x,y)=>x+y)



if (!findCart || findCart.items.length==0) {
    return res.status(404).send({ status: false, message: "CART is Empty" });
}


findCart.totalQuantity=totalQuantity

let createdOrder= await orderModel.create(findCart)

res.status(201).send({status: true, message: "Order created successfully",data:createdOrder})
    }catch(err){
        res.status(500).send({Message:err.message})
    }
}

module.exports={createOrder}
