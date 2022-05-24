const express = require('express')
const router = express.Router();
const aws=require('aws-sdk')
const {registerUser} =require('../controllers/userController')

 aws.config.update({
     credentials: {
         accessKeyId:"AKIAY3L35MCRUJ6WPO6J",
         secretAccessKey:"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"
     },
    region: 'ap-south-1'
 })


router.post('/',function(req,res){
    return res.send("Welcome to main route api!")
})


router.post('/register', registerUser)


module.exports=router;