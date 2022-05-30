const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

let cartModel = new mongoose.Schema({
    userId: { type: ObjectId, refs: "Cart", required: true, unique: true },
    items: [{
        productId: { type: ObjectId, refs: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: { type: Number, required: true },
    totalItems: { type: Number, required: true },
}, { timestamps: true }
)

module.exports = mongoose.model("Cart", cartModel)