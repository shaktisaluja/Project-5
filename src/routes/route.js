const express = require('express');
const router = express.Router();
const userController = require("../controllers/usercontroller");

//user Register
router.post("/register",userController.createuser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',userController.getuserdata)
router.put('/user/:userId/profile',userController.updateUserById)



//If url is Incorrect
router.post("*", (req,res) =>{

    return res.status(404).send({ message:"Page Not Found"})
})
router.get("*", (req,res) =>{
    return res.status(404).send({ message:"Page Not Found"})
})
router.put("*", (req,res) =>{
    return res.status(404).send({ message:"Page Not Found"})
})

router.delete("*", (req,res) =>{
    return res.status(404).send({ message:"Page Not Found"})
})

module.exports = router;