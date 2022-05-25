const express = require('express')
const router = express.Router();
const {createUser,login,getUserData,updateUserById} = require("../controllers/usercontroller");
const {authentication,authorization} =require('../middlewares/auth')


//user Register
router.post("/register", createUser)
router.post('/login', login)
router.get('/user/:userId/profile', authentication,authorization, getUserData)
router.put('/user/:userId/profile', authentication,authorization, updateUserById)


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
