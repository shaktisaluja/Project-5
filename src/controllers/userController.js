const userModel = require("../Models/usermodel")
const {validateEmail,validatePassword,validatefeild,validatestreet,validateNumber,validatepincode} = require("../utilities/validation");
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const aws= require("aws-sdk")
//...............................................AWS CONNECTION..................................................................

aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
  })
  
  let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
  
    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "Shivam/" + file.originalname, //HERE
        Body: file.buffer
    }
  
  
    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })
  
   })
  }
//.............................................PHASE (1) Create user................................................


const createuser = async (req, res) => {
    try {
       const data = req.body;
      if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: "Feild Can't Empty.Please Enter Some Details" });
      }
  
      if (!data.fname) {
        return res.status(400).send({ status: false, message: "fname is missing" });
      }
  
      //Name validation by Rejex
      if (!validatefeild(data.fname)) {
        return res.status(400).send({ status: false, message: "Invalid fname", });
      }
  
      let validString = /\d/;
      if (validString.test(data.fname.trim())) return res.status(400).send({ status: false, message: "Invalid fname! It Should Contain Only aplhabets" });
  
  
  
      if (!data.lname) {
        return res.status(400).send({ status: false, message: "lname is missing" });
      }
  
      //Name validation by Rejex
      if (!validatefeild(data.lname)) {
        return res.status(400).send({ status: false, message: "Invalid lname", });
      }
  
      if (validString.test(data.lname.trim())) return res.status(400).send({ status: false, message: "Invalid lname! It Should Contain Only aplhabets" });
  
      if (!data.email) {
        return res.status(400).send({ status: false, message: "Email is missing" });
      }
  
      //email validation by Rejex
      if (!validateEmail(data.email)) {
        return res.status(400).send({ status: false, message: "Invaild E-mail id." });
      }
  
      const findemail = await userModel.findOne({ email: data.email }); //email exist or not
  
      if (findemail) {
        return res.status(400).send({ status: false, message: `${data.email} Email Id  Already Registered.Please,Give Email ID` })
      }
  
     /*  if (!data.profileImage) {
        return res.status(400).send({ status: false, message: "ProfileImage not given" });
      }
  
       if (!validateprofileImage(data.profileImage)) {
          return res.status(400).send({ status: false, message: "Invaild! ProfileImage" }); //fullName validation By Rejex
        } */
  
  
        if (!data.phone) {
          return res.status(400).send({ status: false, message: "Phone Number is missing" });
        }
        //Phone no. validation by Rejex
        if (!validateNumber(data.phone)) {
          return res.status(400).send({ status: false, message: "Invaild Phone No.." });
        }
  
        const findphoneno = await userModel.findOne({ phone: data.phone });
  
        if (findphoneno) {
          return res.status(400).send({ status: false, message: `${data.phone} Phone no. Already Registered.Please,Give Another Phone.no` })
        }
  
        if (!data.password) {
          return res.status(400).send({ status: false, message: "Password is missing" });
        }
  
        if (!validatePassword(data.password)) {
          return res.status(400).send({ status: false, message: "Password Must contain at-least One number,One special character,One capital letter & length Should be 8-15", }); //password validation
        }
        data.password = bcrypt.hashSync(data.password,10);
  
  
        if(!data.address){
          return res.status(400).send({ status: false, message: "Plase Provide Address" });
        }
  
  
         if(!data.address.shipping){
          return res.status(400).send({ status: false, message: "Please Provide Shipping Address" });
        }
          if (!data.address.shipping.street) {
            return res.status(400).send({ status: false, message: "Please Provide street for shipping" });
          }
            if (!validatestreet(data.address.street)) {
              return res.status(400).send({ status: false, message: "Street must contain Alphabet or Number", });
            }
          if (!data.address.shipping.city) {
            return res.status(400).send({ status: false, message: "Please Provide City for shipping" });
          }
  
            if (!validatefeild(data.address.shipping.city)) {
              return res.status(400).send({ status: false, message: "Invalid City!It should not contain number"});
            }
            let validcity= /\d/;
            if (validcity.test(data.address.shipping.city)) return res.status(400).send({ status: false, msg:  "Invalid City!It should not contain number"});
  
            if (!data.address.shipping.pincode) {
            return res.status(400).send({ status: false, message: "Please Provide Pincode for shipping" });
          }
            if (!validatepincode(data.address.shipping.pincode)) {
              return res.status(400).send({ status: false, message: "Invalid Pincode", });
            }
  
         if(!data.address.billing){
          return res.status(400).send({ status: false, message: "Please Provide Billing Address" });
        }
          if (!data.address.billing.street) {
            return res.status(400).send({ status: false, message: "Please Provide street for Billing" });
          }
            if (!validatestreet(data.address.billing.street)) {
              return res.status(400).send({ status: false, message: "Invalid Street!", });
            }
          if (!data.address.billing.city) {
            return res.status(400).send({ status: false, message: "Please Provide City for Billing" });
          }
            if (!validatefeild(data.address.billing.city)) {
              return res.status(400).send({ status: false, message: "Invalid City!It should not contain number", });
            }
            let validbillingcity= /\d/;
  
            if (validbillingcity.test(data.address.billing.city)) return res.status(400).send({ status: false, msg:  "Invalid City!It should not contain number"});
  
          if (!data.address.billing.pincode) {
            return res.status(400).send({ status: false, message: "Please Provide Pincode for Billing" });
          }
  
            if (!validatepincode(data.address.billing.pincode)) {
              return res.status(400).send({ status: false, message: "Invalid Pincode", });
            }
  
            let files= req.files
            if(files && files.length>0){
                let uploadedFileURL= await uploadFile( files[0] )
                data.profileImage=uploadedFileURL
            }
            else{
                return res.status(400).send({ msg: "No file found" })
            }
      const user = await userModel.create(data);
      return res.status(201).send({ status: true, message: "User created successfully", data:user });
    }
  
    catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };
  //.............................................POST /login........................................................

const login = async function (req, res) {
    try {
      const data = req.body;
  
      if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: "Feild Can't Empty.Please Enter Some Details" }); //details is given or not
      }
  
      let email = req.body.email;
      let password = req.body.password;
  
      if (!email) {
        return res.status(400).send({ sataus: false, message: "Email is missing" });
      }
  
      if (!password) {
        return res.status(400).send({ status: false, message: "Password not given" });
      }
      const findemail = await userModel.findOne({ email: email})
  
        if (!findemail)
       return res.status(401).send({ status: false, message: "Email Not Found" });
  
  
      if(!bcrypt.compareSync(password, findemail.password)) {
        return res.status(400).send({ message: "Incorrect Password" });
    }
  
      let token = jwt.sign(
        { "UserId": findemail._id },
        "group51", { expiresIn: '5h'}  //sectetkey
      );
  
      res.setHeader("x-api-key", token);
      /* let  details = JSON.parse(JSON.stringify(findemail._id))
      details.token = token */
      res.status(200).send({ status: true, message:"User login successfull",data: token });
    }
  
    catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };
  
  //.................................................getuser/:userId/profile.............................................
  
  const getuserdata = async function (req, res) {
    try{
  
        const userId = req.params.userId;
  
  
        if (!userId){
            return res.status(400).send({status:false,message:"Please Provide UserId"});
        }
  
        let isValidUserId = mongoose.Types.ObjectId.isValid(userId);//check if objectId is valid objectid
      if (!isValidUserId) {
        return res.status(400).send({ status: false, message: "UserId is Not Valid" });
      }
  
        const findUserDetails = await userModel.findOne({_id: userId}).select({ address:1,_id:1,fname:1,lname:1,email:1,profileImage:1,phone:1,password:1,createdAt:1,updatedAt:1,__v:1});
        if (!findUserDetails) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }
  
       res.status(200).send({status:true,data: findUserDetails})
  }
    catch (err){
  res.status(500).send({ status: false, message: err.message });
  }};

  //..............................................PUT /user/:userId/profile..........................................................


const updateUserById = async function (req, res) {
    try {
  
      const userId = req.params.userId;
      let files= req.files
  
  
      if (!userId){
          return res.status(400).send({status:false,message:"Please Provide UserId"});
      }
  
      let isValidUserId = mongoose.Types.ObjectId.isValid(userId);//check if objectId is valid objectid
    if (!isValidUserId) {
      return res.status(400).send({ status: false, message: "UserId is Not Valid" });
    }
  
      const findUserDetails = await userModel.findOne({_id: userId}).select({ address:1,_id:1,fname:1,lname:1,email:1,profileImage:1,phone:1,password:1,createdAt:1,updatedAt:1,__v:1});
      if (!findUserDetails) {
          return res.status(404).send({ status: false, message: "User Not Found" });
      }
  
      if (!req.body.fname && !req.body.lname && !req.body.email && !req.files && !req.body.phone && !req.body.password && !req.body.address) {
        return res.status(400).send({ status: false, message: "Please Provide data to update" })
      }
  
      if (req.body.fname) {
        findUserDetails.fname = req.body.fname
  
  
        if (!validatefeild (findUserDetails.fname)) {
          return res.status(400).send({ status: false, message: "Invalid fname", });
        }
  
        let validString = /\d/;
        if (validString.test(req.body.fname.trim())) return res.status(400).send({ status: false, message: "Invalid fname! It Should Contain Only aplhabets" });
      }
      if (req.body.lname) {
        findUserDetails.lname = req.body.lname
  
         //Name validation by Rejex
      if (!validatefeild(findUserDetails.lname)) {
        return res.status(400).send({ status: false, message: "Invalid lname", });
      }
      let validString = /\d/;
  
      if (validString.test(findUserDetails.lname.trim())) return res.status(400).send({ status: false, message: "Invalid lname! It Should Contain Only aplhabets" });
      }
      if (req.body.email) {
        findUserDetails.email = req.body.email
  
         //email validation by Rejex
      if (!validateEmail(findUserDetails.email)) {
        return res.status(400).send({ status: false, message: "Invaild E-mail id." });
      }
  
      const findemail = await userModel.findOne({ email: req.body.email }); //email exist or not
  
      if (findemail) {
        return res.status(400).send({ status: false, message: `${req.body.email} Email Id  Already Registered.Please,Give Email ID` })
      }
  
      }
  
      if (req.body.phone) {
        findUserDetails.phone = req.body.phone
  
         //Phone no. validation by Rejex
         if (!validateNumber(findUserDetails.phone)) {
          return res.status(400).send({ status: false, message: "Invaild Phone No.." });
        }
  
        const findphoneno = await userModel.findOne({ phone: req.body.phone });
  
        if (findphoneno) {
          return res.status(400).send({ status: false, message: `${req.body.phone} Phone no. Already Registered.Please,Give Another Phone.no` })
        }
      }
      if (req.body.password) {
        findUserDetails.password = req.body.password
  
        if (!validatePassword(findUserDetails.password)) {
          return res.status(400).send({ status: false, message: "Password Must contain at-least One number,One special character,One capital letter & length Should be 8-15", }); //password validation
        }
        findUserDetails.password = bcrypt.hashSync(req.body.password,10);
  
      }
  
      if(req.body.address)
      {
        if(req.body.address.shipping){
      if (req.body.address.shipping.street) {
        findUserDetails.address.shipping.street = req.body.address.shipping.street
        if (!validatestreet( findUserDetails.address.shipping.street)) {
          return res.status(400).send({ status: false, message: "Street must contain Alphabet or Number", });
        }
  
  
      }
      if (req.body.address.shipping.city) {
        findUserDetails.address.shipping.city = req.body.address.shipping.city
        if (!validatefeild(findUserDetails.address.shipping.city)) {
          return res.status(400).send({ status: false, message: "Invalid City!It should not contain number"});
        }
        let validcity= /\d/;
        if (validcity.test(req.body.address.shipping.city)) return res.status(400).send({ status: false, msg:  "Invalid City!It should not contain number"});
  
  
      }
      if (req.body.address.shipping.pincode) {
        findUserDetails.address.shipping.pincode = req.body.address.shipping.pincode
  
        if (!validatepincode(findUserDetails.address.shipping.pincode)) {
          return res.status(400).send({ status: false, message: "Invalid Pincode", });
        }
      }
    }
    if(req.body.address.billing){
      if (req.body.address.billing.street) {
        findUserDetails.address.billing.street = req.body.address.billing.street
  
        if (!validatestreet(findUserDetails.address.billing.street)) {
          return res.status(400).send({ status: false, message: "Invalid Street!", });
        }
  
      }
      if (req.body.address.billing.city) {
        findUserDetails.address.billing.city = req.body.address.billing.city
        if (!validatefeild( findUserDetails.address.billing.city)) {
          return res.status(400).send({ status: false, message: "Invalid City!It should not contain number", });
        }
        let validbillingcity= /\d/;
  
        if (validbillingcity.test(req.body.address.billing.city)) return res.status(400).send({ status: false, msg:  "Invalid City!It should not contain number"});
  
  
      }
      if (req.body.address.billing.pincode) {
        findUserDetails.address.billing.pincode = req.body.address.billing.pincode
  
        if (!validatepincode( findUserDetails.address.billing.pincode)) {
          return res.status(400).send({ status: false, message: "Invalid Pincode", });
        }
      }
    }
    }
  
    if (req.files) {
  
  
      if(files && req.files.length>0){
          let uploadedFileURL= await uploadFile( files[0] )
          findUserDetails.profileImage=uploadedFileURL
      }
      else{
          return res.status(400).send({ msg: "No file found" })
      }
    }
  
     findUserDetails.save()
     return res.status(200).send({ status: true, message:"User Profile updated", data: findUserDetails })
  
    }
    catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  }  
  
  
module.exports.createuser = createuser
module.exports.login = login
module.exports.getuserdata = getuserdata
module.exports.updateUserById = updateUserById