const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const { userModel } = require("../Models/userModel")
const { isValidBody, isValidObjectId } = require("../utilities/validation");


const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "User Id is Not Valid" });
        }

        
        const findUserDetails = await userModel.findOne({ _id: userId })
        if (!findUserDetails) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        let findCart = await cartModel.findOne({ userId: userId }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }).lean()

        if (!findCart || findCart.items.length == 0) {
            return res.status(404).send({ status: false, message: "CART is empty" });
        }
        let totalQuantity = findCart.items.map(x => x.quantity).reduce((x, y) => x + y)

        findCart.totalQuantity = totalQuantity

        let createdOrder = await orderModel.create(findCart)

        return res.status(201).send({ status: true, message: "Order created successfully", data: createdOrder })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};




//...................................PUT /users/:userId/orders......................................................


const putOrder = async function (req, res) {
    try {


        const userId = req.params.userId;

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "UserId is Not Valid" });
        }

        const findUserDetails = await userModel.findOne({ _id: userId })
        if (!findUserDetails) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        const data = req.body;

        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Field can't not be empty.Please enter some details" });
        }


        const { orderId, status } = data;
        if (!orderId) {
            return res.status(400).send({ status: false, message: "Please enter orderId in body " });
        }
        if (!status) {
            return res.status(400).send({ statua: false, message: "Please enter status in body " });
        }

        let validstatus = ["pending", "completed", "cancelled"];
        if (!validstatus.includes(status.trim())) return res.status(400).send({ status: false, message: "Status should be one of pending,completed,cancelled" });



        const orderFind = await orderModel.findOne({ _id: orderId, userId: userId });
        if (!orderFind) {
            return res.status(404).send({ status: false, message: "Order not found " });
        }


        if (orderFind.cancellable == true) {
            if (orderFind.status == "pending") {
                const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true });
                if (!updateStatus) {
                    return res.status(400).send({ status: false, message: "Wont's able to change status " });
                }
                return res.status(200).send({ status: true, message: "Order updated successfully", data: updateStatus });
            }

            if (orderFind.status == "completed") {
                return res.status(400).send({ status: false, message: "Order already completed, won't able to change status " });
            }

            if (orderFind.status == "cancelled") {
                return res.status(400).send({ status: false, message: "Order is already cancelled " });
            }
        }


        if (orderFind.cancellable == false) {
            return res.status(400).send({ status: false, message: "This Order Cannot be cancellable " });
        }
    } catch (err) {
        res.status(500).send({ status: false, msmessageg: err.message });
    }
};



module.exports = { createOrder, putOrder };




