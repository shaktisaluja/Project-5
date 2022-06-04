const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const { validateEmail, validateNumber } = require("../utilities/validation")

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true, validate: { validator: validateEmail, message: "Not a valid email address" } },
    profileImage: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true, validate: { validator: validateNumber, message: "Not a valid phone number" } },
    password: { type: String, required: true, trim: true },
    address: {
        shipping: {
            street: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            pincode: { type: Number, required: true, trim: true },
        },
        billing: {
            street: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            pincode: { type: Number, required: true, trim: true },
        }

    }
}, { timestamps: true })


const passwordSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true }
})



const userModel = mongoose.model('User', userSchema)//users
const passwordModel = mongoose.model('Password', passwordSchema)//passwords

module.exports = { userModel, passwordModel }








