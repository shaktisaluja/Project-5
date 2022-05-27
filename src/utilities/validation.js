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

//Validating json input
let isValidBody = (value) => {
  if (Object.keys(value).length === 0) return false;
  return true;
}

//Image file Validation
const isFileImage = (file) => {
  let ext = ['png', 'jpg', 'jpeg']
  let fileExt = file.originalname.split('.')
  return ext.includes(fileExt[fileExt.length - 1])
}

//Validating input should not be null
let isValid = (value) => {
  if ((type = "string" && value.trim().length === 0) || value == null || Object.keys(value).length === 0) return false;
  return true;
}

//Checking value should be positive number
let isValidNumber = (value) => {
  if (typeof value == "number" && value < 0 || isNaN(value) || (typeof value == "string" && (Number(value.trim()) < 0|| value.trim().length == 0))) return false
  return true;
}

//Regex to validate number
let isNumber = (value) => {
  let numberRegex = /\d/;
  return numberRegex.test(value);
}


//Validating currency type
let isValidCurrency = (value) => {
  if (value.trim().toUpperCase() !== "INR") return false;
  return true;
}

//Validating currency format
let isValidCurrencyFormat = (value) => {
  if (value.trim().toUpperCase() !== "₹") return false;
  return true;
}

//Validating boolean type
let isValidBoolean = (value) => {
  if (typeof value == "string" && (value == "false" || value == "true")) { return true }
  else if (typeof (value) == "boolean") return true;
  return false;
}

//Validating size
let isValidSize = (value) => {
  value=value.trim().split(",").map(ele=>ele.trim())
  let validSize = ["S", "XS", "M", "X", "L", "XXL", "XL"];
  for(let i=0;i<value.length;i++){
    if (!validSize.includes(value[i])) return false;
  }
  return true;
}

/*  //VALIDATION OF logolink BY REJEX
const validateprofileImage= (Image) => {
  return String(Image).trim().match
  (/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/);
}; */

module.exports = { validateEmail, validatePassword, validateFeild, validateStreet, validateNumber, validatePincode, isValidObjectId, isValidBody, isFileImage, isValidCurrency, isValidCurrencyFormat, isValidBoolean, isValidSize, isValid, isValidNumber, isNumber }