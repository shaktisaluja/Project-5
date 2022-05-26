const mongoose = require('mongoose');
let objectId = mongoose.Types.ObjectId

//EMAIL VALIDATION BY REJEX
const validateEmail = (email) => {
  return (email).trim().match(
    /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/);
};

//PASSWORD VALIDATION BY REJEX
const validatePassword = (password) => {
  return String(password).trim().match(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/);
};

//STRING VALIDATION BY REJEX
const validateFeild = (name) => {
  return String(name).trim().match(
    /^[A-Za-z\s]{1,}[A-Za-z\s]{0,}$/);
};


//STREET VALIDATION BY REJEX
const validateStreet = (name) => {
  return String(name).trim().match(
    /^[a-zA-Z0-9_.-]/);
};


//VALIDATION OF MOBILE NO BY REJEX
const validateNumber = (Feild) => {
  return String(Feild).trim().match
    (/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/);
};


//VALIDATION OF PINCODE BY REJEX
const validatePincode = (pincode) => {
  return String(pincode).trim().match(
    /^(\d{4}|\d{6})$/);
};

//VALIDATION OF OBJECT ID
let isValidObjectId = (value) => {
  return objectId.isValid(value)
};

let isValidBody= (value) => {
  if(Object.keys(value).length===0) return false;
  return true;
}


//Image file Validation
const isFileImage = (file) => {
  let ext = ['png', 'jpg', 'jpeg']
  let fileExt = file.originalname.split('.')
  console.log(fileExt)
  return ext.includes(fileExt[fileExt.length-1])
}


/*  //VALIDATION OF logolink BY REJEX
const validateprofileImage= (Image) => {
  return String(Image).trim().match
  (/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/);
}; */

module.exports = { validateEmail, validatePassword, validateFeild, validateStreet, validateNumber, validatePincode, isValidObjectId,isValidBody ,isFileImage}