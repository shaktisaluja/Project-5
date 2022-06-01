const express = require('express')
const router = express.Router();
const { createUser, login, getUserData, updateUserById } = require("../controllers/usercontroller");
const { authentication, authorization } = require('../middlewares/auth')
const { createProduct, getProduct, deleteProduct, getProductsById, updateProduct } = require("../controllers/productController");
const { createCart, updateCart ,getCart,delCart } = require("../controllers/cartController")
const{createOrder,putOrder}=require("../controllers/orderController")
//const{createCart} =require("../controllers/cartController")

//user Register
router.post("/register", createUser)
router.post('/login', login)
router.get('/user/:userId/profile', authentication, getUserData)
router.put('/user/:userId/profile', authentication, authorization, updateUserById)

//Product
router.post("/products", createProduct)
router.get("/products", getProduct)
router.get("/products/:productId", getProductsById)
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteProduct)

//Cart
router.post("/users/:userId/cart",authentication,authorization, createCart)
router.put('/users/:userId/cart', authentication, authorization, updateCart)
router.get('/users/:userId/cart', authentication, authorization, getCart)
router.delete('/users/:userId/cart', authentication, authorization, delCart)

//order
router.post("/users/:userId/orders",createOrder)
router.put("/users/:userId/orders",putOrder)



//If url is Incorrect
router.post("*", (req, res) => {

    return res.status(404).send({ message: "Page Not Found" })
})
router.get("*", (req, res) => {
    return res.status(404).send({ message: "Page Not Found" })
})
router.put("*", (req, res) => {
    return res.status(404).send({ message: "Page Not Found" })
})

router.delete("*", (req, res) => {
    return res.status(404).send({ message: "Page Not Found" })
})

module.exports = router;
