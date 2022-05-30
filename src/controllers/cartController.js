const { isValidObjectId } = require('mongoose');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const { isValidBody } = require('../utilities/validation');

const updateCart = async function (req, res) {

    const userId = req.params.userId;
    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Not a valid user id" })

    const requestBody = req.body;
    if (!isValidBody(requestBody)) return res.status(400).send({ status: false, message: "Input is required from user" })

    const { productId, removeProduct } = requestBody

    if (!productId) return res.status(400).send({ status: false, message: "Product id is required" })
    if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Not a valid product id" })

    const getProduct = await productModel.findOne({ _id: productId, isDeleted: false })

    if (!getProduct) return res.status(404).send({ status: false, message: "No product exist" })

    const productPrice = getProduct.price;

    const getCart = await cartModel.findOne({ userId: userId })

    if (getCart) {

        const cartId = getCart._id;
        let totalItems = getCart.totalItems;
        let totalPrice = getCart.totalPrice;

        if (!getCart.items.length) return res.status(404).send({ status: true, message: "Cart is empty" })

        for (let i = 0; i < getCart.items.length; i++) {

            if (getCart.items[i].productId == productId) {

                let productQuantity = getCart.items[i].quantity;

                if (removeProduct == 0) {

                    if (productQuantity >= 1) {
                        totalItems = totalItems - productQuantity
                        totalPrice = totalPrice - (productQuantity * productPrice)

                        const updateCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId, quantity: productQuantity } }, $set: { totalPrice: totalPrice, totalItems: totalItems } }, { new: true })

                        return res.status(200).send({ status: true, message: "Successful", data: updateCart })
                    }
                    else {
                        return res.status(404).send({ status: true, message: "No product exist" })
                    }
                }
                else if (removeProduct == 1) {

                    if (productQuantity > 1) {

                        totalItems = totalItems - 1;
                        totalPrice = totalPrice - productPrice;

                        const updateCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $inc: { [`items.${i}.quantity`]: -1 }, $set: { totalPrice: totalPrice, totalItems: totalItems } }, { new: true })

                        return res.status(200).send({ status: true, message: "Succescful", data: updateCart })
                    }
                    else if (productQuantity == 1) {

                        totalItems = totalItems - 1;
                        totalPrice = totalPrice - productPrice;

                        const updateCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId, quantity: productQuantity } }, $set: { totalPrice: totalPrice, totalItems: totalItems } }, { new: true })

                        return res.status(200).send({ status: true, message: "Succescful", data: updateCart })
                    }
                }
                else if (removeProduct > 1 && removeProduct < 0) {

                    return res.status(400).send({ status: false, message: "Not a valid input" })
                }
                else if (!removeProduct) {

                    return res.status(400).send({ status: false, message: "No input to remove product" })
                }


            }
            
        }


    }

    else if (!getCart) return res.status(400).send({ status: false, message: "No cart exist" })

}


module.exports = { updateCart }