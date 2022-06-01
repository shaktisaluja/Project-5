const { userModel, passwordModel } = require("../Models/userModel")
const { validateEmail, isFileImage, validatePassword, validateFeild, validateStreet, validateNumber, validatePincode, isValidObjectId, isValidBody } = require("../utilities/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { uploadFile } = require('../utilities/uploadFile')


//.............................................PHASE (1) Create user................................................


const createUser = async (req, res) => {
  try {
    /* const data = req.body; */
    let tempPass = req.body.password
    let data = JSON.parse(JSON.stringify(req.body))
    /*  let body = JSON.parse(JSON.stringify(req.body)) */

    // !isValidBody(data) Checking keys inside the object in req.body
    if (!isValidBody(data)) {

      return res.status(400).send({ status: false, message: "Field can't be empty. Please enter some details" });
    }

    if (!data.fname) {
      return res.status(400).send({ status: false, message: "fname is missing" });
    }

    //Name validation by Rejex
    if (!validateFeild(data.fname)) {

      return res.status(400).send({ status: false, message: "Invalid fname", });
    }

    if (!data.lname) {
      return res.status(400).send({ status: false, message: "lname is missing" });
    }

    //Name validation by Rejex
    if (!validateFeild(data.lname)) {
      return res.status(400).send({ status: false, message: "Invalid lname", });
    }

    if (!validateFeild(data.lname.trim())) return res.status(400).send({ status: false, message: "Invalid lname! It Should Contain Only aplhabets" });

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
    data.password = bcrypt.hashSync(data.password, 10);


    if (!data.address) {
      return res.status(400).send({ status: false, message: "Plase Provide Address" });
    }
  
    data.address = JSON.parse(data.address)
   
    if (!data.address.shipping) {
      return res.status(400).send({ status: false, message: "Please Provide Shipping Address" });
    }
    if (!data.address.shipping.street) {
      return res.status(400).send({ status: false, message: "Please Provide street for shipping" });
    }
    if (!validateStreet(data.address.street)) {
      return res.status(400).send({ status: false, message: "Street must contain Alphabet or Number", });
    }
    if (!data.address.shipping.city) {
      return res.status(400).send({ status: false, message: "Please Provide City for shipping" });
    }

    if (!validateFeild(data.address.shipping.city)) {
      return res.status(400).send({ status: false, message: "Invalid City!It should not contain number" });
    }

    if (!data.address.shipping.pincode) {
      return res.status(400).send({ status: false, message: "Please Provide Pincode for shipping" });
    }
    if (!validatePincode(data.address.shipping.pincode)) {
      return res.status(400).send({ status: false, message: "Invalid Pincode", });
    }

    if (!data.address.billing) {
      return res.status(400).send({ status: false, message: "Please Provide Billing Address" });
    }
    if (!data.address.billing.street) {
      return res.status(400).send({ status: false, message: "Please Provide street for Billing" });
    }
    if (!validateStreet(data.address.billing.street)) {
      return res.status(400).send({ status: false, message: "Invalid Street!", });
    }
    if (!data.address.billing.city) {
      return res.status(400).send({ status: false, message: "Please Provide City for Billing" });
    }
    if (!validateFeild(data.address.billing.city)) {
      return res.status(400).send({ status: false, message: "Invalid City!It should not contain number", });
    }

    if (!data.address.billing.pincode) {
      return res.status(400).send({ status: false, message: "Please Provide Pincode for Billing" });
    }

    if (!validatePincode(data.address.billing.pincode)) {
      return res.status(400).send({ status: false, message: "Invalid Pincode", });
    }

    let files = req.files
    if (!req.files.length) {
      return res.status(400).send({ msg: "File is Required" })
    }
    if (req.files.length) {
      let check = isFileImage(req.files[0])
      if (!check)
        return res.status(400).send({ status: false, message: 'Invalid file, image only allowed', });
    }

    let dirName = "profileImage_v01";
    let uploadedFileURL = await uploadFile(files[0], dirName)
    data.profileImage = uploadedFileURL


    const user = await userModel.create(data);
    /************************Storing Password for MySelf*******************************/
    await passwordModel.create({ userId: user._id, email: user.email, password: tempPass })
    /*********************************************************************************/
    return res.status(201).send({ status: true, message: "User created successfully", data: user });
  }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
//.............................................POST /login........................................................

const login = async function (req, res) {
  try {
    const data = req.body;

    if (!isValidBody(data)) {
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
    const findemail = await userModel.findOne({ email: email })

    if (!findemail)
      return res.status(401).send({ status: false, message: "Email Not Found" });


    if (!bcrypt.compareSync(password, findemail.password)) {
      return res.status(400).send({ message: "Incorrect Password" });
    }

    let token = jwt.sign(
      { "UserId": findemail._id },
      "7dfcdb28dc1cea52f80fd28dca4124530b260c8b8f6afe2bb07b68441189738d3e464339a279ee42f726a488f8efa4c3cf57570977cd6d1a108a9b3943215375", { expiresIn: '2d' }  //sectetkey
    );

    res.setHeader("x-api-key", token);
    /* let  details = JSON.parse(JSON.stringify(findemail._id))
    details.token = token */
    res.status(200).send({ status: true, message: "User login successfull", data: token });
  }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//.................................................getuser/:userId/profile.............................................

const getUserData = async function (req, res) {
  try {

    const userId = req.params.userId;


    if (!userId) {
      return res.status(400).send({ status: false, message: "Please Provide UserId" });
    }

    //check if objectId is valid objectid
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "UserId is Not Valid" });
    }

    const findUserDetails = await userModel.findOne({ _id: userId }).select({ address: 1, _id: 1, fname: 1, lname: 1, email: 1, profileImage: 1, phone: 1, password: 1, createdAt: 1, updatedAt: 1, __v: 1 });
    if (!findUserDetails) {
      return res.status(404).send({ status: false, message: "User Not Found" });
    }

    res.status(200).send({ status: true, data: findUserDetails })
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//..............................................PUT /user/:userId/profile..........................................................


const updateUserById = async function (req, res) {
  try {

    const userId = req.params.userId;
    let files = req.files
    let data = JSON.parse(JSON.stringify(req.body)) 
    console.log(data)


    if (!userId) {
      return res.status(400).send({ status: false, message: "Please Provide UserId" });
    }

    //check if objectId is valid objectid
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "UserId is Not Valid" });
    }

    const findUserDetails = await userModel.findOne({ _id: userId }).select({ address: 1, _id: 1, fname: 1, lname: 1, email: 1, profileImage: 1, phone: 1, password: 1, createdAt: 1, updatedAt: 1, __v: 1 });
    if (!findUserDetails) {
      return res.status(404).send({ status: false, message: "User Not Found" });
    }

    if (!data.fname && !data.lname && !data.email && !req.files && !data.phone && !data.password && !data.address) {
      return res.status(400).send({ status: false, message: "Please Provide data to update" })
    }
    
    if (data.fname) {
      findUserDetails.fname = data.fname
      console.log(findUserDetails.fname)
     


      if (!validateFeild(findUserDetails.fname)) {
        return res.status(400).send({ status: false, message: "Invalid fname", });
      }
    }
    if (data.lname) {
      findUserDetails.lname = data.lname

      //Name validation by Rejex
      if (!validateFeild(findUserDetails.lname)) {
        return res.status(400).send({ status: false, message: "Invalid lname", });
      }
    }
    if (data.email) {
      findUserDetails.email = data.email

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
      findUserDetails.password = bcrypt.hashSync(req.body.password, 10);

    }

    if (req.body.address) {
      if (req.body.address.shipping) {
        if (req.body.address.shipping.street) {
          findUserDetails.address.shipping.street = req.body.address.shipping.street
          if (!validateStreet(findUserDetails.address.shipping.street)) {
            return res.status(400).send({ status: false, message: "Street must contain Alphabet or Number", });
          }


        }
        if (req.body.address.shipping.city) {
          findUserDetails.address.shipping.city = req.body.address.shipping.city
          if (!validateFeild(findUserDetails.address.shipping.city)) {
            return res.status(400).send({ status: false, message: "Invalid City!It should not contain number" });
          }

        }
        if (req.body.address.shipping.pincode) {
          findUserDetails.address.shipping.pincode = req.body.address.shipping.pincode

          if (!validatePincode(findUserDetails.address.shipping.pincode)) {
            return res.status(400).send({ status: false, message: "Invalid Pincode", });
          }
        }
      }
      if (req.body.address.billing) {
        if (req.body.address.billing.street) {
          findUserDetails.address.billing.street = req.body.address.billing.street

          if (!validateStreet(findUserDetails.address.billing.street)) {
            return res.status(400).send({ status: false, message: "Invalid Street!", });
          }

        }
        if (req.body.address.billing.city) {
          findUserDetails.address.billing.city = req.body.address.billing.city
          if (!validateFeild(findUserDetails.address.billing.city)) {
            return res.status(400).send({ status: false, message: "Invalid City!It should not contain number", });
          }

        }
        if (req.body.address.billing.pincode) {
          findUserDetails.address.billing.pincode = req.body.address.billing.pincode

          if (!validatePincode(findUserDetails.address.billing.pincode)) {
            return res.status(400).send({ status: false, message: "Invalid Pincode", });
          }
        }
      }
    }

    if (req.files.length!==0) {
        let check = isFileImage(req.files[0])
        if (!check)
          return res.status(400).send({ status: false, message: 'Invalid file, image only allowed', })
  
      let dirName = "profileImage_v01";
      let uploadedFileURL = await uploadFile(files[0], dirName)
      findUserDetails.profileImage = uploadedFileURL
      }
     

    findUserDetails.save()
    return res.status(200).send({ status: true, message: "User Profile updated", data: findUserDetails })

  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}


module.exports = { createUser, login, getUserData, updateUserById }
