const express = require('express')
const router = express.Router();
const {createuser,login,getuserdata,updateUserById} = require("../controllers/usercontroller");
const {createProduct} = require("../controllers/productController");
const {authentication} =require('../middlewares/auth')


//user Register
router.post("/register", createuser)
router.post('/login', login)
router.get('/user/:userId/profile', authentication, getuserdata)
router.put('/user/:userId/profile', authentication, updateUserById)


//Product
router.post("/products", createProduct)





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
