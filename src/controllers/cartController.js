const cartModel=require("../models/cartModel")
 const productModel=require("../models/productModel")
 const {userModel, passwordModel} = require("../Models/userModel")
 //let  userModel=require("../models/userModel")
 const {uploadFile} = require('../utilities/uploadFile')

 const { validateStreet, isValidBody, isValidCurrency, isValidCurrencyFormat, isValidSize, isValidNumber, isValid, isFileImage, isValidBoolean, isValidObjectId, isNumber ,validateFeild} = require("../utilities/validation");







const createCart=async function(req,res){
    try{
let userId=req.params.userId
const {productId,cartId,quantity}= req.body

if (!isValidObjectId(userId)){
return res.status(400).send({ status: false, message: "USER ID is Not Valid" });
}
if (!isValidBody(req.body)) {
 return res.status(400).send({ status: false, message: "Field can't not be empty.Please enter some details" });
}
// if (!isValidObjectId(productId)){
//     return res.status(400).send({ status: false, message: "PRODUCT ID is Not Valid" });
// } 
// if (!isValidObjectId(cartId)){
//     return res.status(400).send({ status: false, message: "CART ID is Not Valid" });
// }


const findUserDetails = await userModel.findOne({ _id: userId })
if (!findUserDetails) {
  return res.status(404).send({ status: false, message: "USER Not Found" });
}
const findProductDetails = await productModel.findOne({ _id: productId ,isDeleted:false}).select({_id:0,price:1})
let price=findProductDetails.price

if (!findProductDetails) {
  return res.status(404).send({ status: false, message: "PRODUCT Not Found" });
}

if(quantity==0)return res.status(400).send({message:"Quantity should not be zer0"})
const findCart= await cartModel.findOne({ userId: userId })
const itemsMatch= await cartModel.findOne({ userId: userId }).select({items:1,_id:0})

const productMatch=itemsMatch.items.map(x=>x.productId.toString())


if(productMatch.includes(productId)){
    await cartModel.findOneAndUpdate({userId:userId}  )
}


let product={
    productId:productId,
    quantity:quantity
}
if(findCart){

await cartModel.findOneAndUpdate({userId:userId},{$addToSet:{items:product},$inc: { totalPrice:price* quantity,totalItems: quantity }} ,{new:true})
}
//console.log(findCart)

let data={
    userId:userId ,
  items: [{
    productId:productId, 
    quantity: quantity
  }],
  totalPrice:price* quantity,
  totalItems:quantity
}

if(!findCart){
let createdCart = await cartModel.create(data)
res.status(201).send({Msg:"Working",data:createdCart})
}
else {
    res.status(200).send({msg:findCart})
}

    }catch(err){
        res.send({message:err.message})
    }

}


module.exports={createCart}