const productModel = require("../models/productModel")
const { validateStreet, isValidBody, isValidCurrency, isValidCurrencyFormat, isValidSize, isValidNumber, isValid, isFileImage } = require("../utilities/validation");
const mongoose = require('mongoose')
const { uploadFile } = require('../utilities/uploadFile')


//.............................................PHASE (2) POST /products................................................


const createProduct = async (req, res) => {
  try {

    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data)
    } else {
      data = req.body;
    }

    if (!isValidBody(data)) {
      return res.status(400).send({ status: false, message: "Field can't not be empty.Please enter some details" });
    }

    let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments, isDeleted } = data

    if (!title) {
      return res.status(400).send({ status: false, message: "Title is missing" });
    }

    //Title validation by Rejex
    if (!validateStreet(data.title)) {
      return res.status(400).send({ status: false, message: "Invalid Title", });
    }

    const findtitle = await productModel.findOne({ title: title }); //title exist or not


    if (findtitle) {
      return res.status(400).send({ status: false, message: `${data.title} Already Exist.Please,Give Another Title` })
    }


    if (!description) {
      return res.status(400).send({ status: false, message: "Description is missing" });
    }

    //Title validation by Rejex
    if (!validateStreet(description)) {
      return res.status(400).send({ status: false, message: "Invalid description", });
    }

    if (!price) {
      return res.status(400).send({ status: false, message: "Price Not Given" });
    }

    if (!isValidNumber(price)) {
      return res.status(400).send({ status: false, message: "Invalid Price Format" });
    }

    if (currencyId) {
      if (!isValidCurrency(currencyId)) {
        return res.status(400).send({ status: false, message: "Invalid CurrencyId" });
      }
    }

    if (currencyFormat == "" || currencyFormat) {
      if (!isValidCurrencyFormat(currencyFormat)) {
        return res.status(400).send({ status: false, message: "Invalid currencyFormat" });
      }
    }

    if (isFreeShipping) {
      console.log(typeof isFreeShipping)
      if (typeof (isFreeShipping) != "Boolean") {
        return res.status(400).send({ status: false, message: "Invalid isFreeShipping Format.It must be true or false" });
      }
    }

    if (style == "" || style) {
      if (!validateStreet(style)) {
        return res.status(400).send({ status: false, message: "Invalid Style Format", });
      }
    }

    if (data.availableSizes) {
      //  for (let i = 0; i <= data.availableSizes.length; i++)
      //   console.log(data.availableSizes)
      if (!isValidSize(availableSizes)) {
        return res.status(400).send({ status: false, message: "AvailableSizes should be of S,XS,M,X, L,XXL,XL" });
      }
    }


    if (installments == "" || installments) {
      if (!isValidNumber(installments)) {
        return res.status(400).send({ status: false, message: "Invalid installments Format" });
      }
    }

    if (isDeleted) {
      if (typeof (isDeleted) != "boolean") {
        return res.status(400).send({ status: false, message: "Invalid Input of isDeleted.It must be true or false " });
      }
      if (isDeleted == true) {
        return res.status(400).send({ status: false, message: "isDeleted must be false while creating Product" });
      }
    }

    let files = req.files
    if (!files.length) return res.status(400).send({ msg: "File is Required" })
    let check = isFileImage(files[0])
    if (!check) return res.status(400).send({ status: false, message: 'Invalid file, image only allowed'})
    let dirName = "productImage_v01";
    let uploadedFileURL = await uploadFile(files[0], dirName)
    if(!uploadedFileURL) return res.status(404).send({ status: false, message: 'No file found'})
    data.productImage = uploadedFileURL

    const product = await productModel.create(data);
    return res.status(201).send({ status: true, message: "Product created successfully", data: product });

  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}

let getProduct = async function (req, res) {

  let reqParams = req.query
  
  if (!isValidBody(reqParams)) {

    let findProduct = await productModel.find({ isDeleted: false }).sort({ price: 1 })

    if (!isValidBody(findProduct)) return res.status(404).send({ status: false, message: "Product not found" })

    if (findProduct) {
      return res.status(200).send({ status: true, message: "successfull", data: findProduct })
    }
  }
  else if (isValidBody(reqParams)) {

    let { size, name, priceGreaterThan, priceLessThan } = reqParams

    if (size == "" || size) {
      if (!isValidSize(size)) return res.status(400).send({ status: false, message: "Not a valid size" })
    }

    if (name == "" || name) {
      if (!isValid(name)) return res.status(400).send({ status: false, message: "Not a valid name" })
    }

    if (priceGreaterThan == "" || priceGreaterThan) {
      if (!isValidNumber(priceGreaterThan)) return res.status(400).send({ status: false, message: "Not a valid prize" })
    }

    if (priceLessThan == "" || priceLessThan) {
      if (!isValidNumber(priceLessThan)) return res.status(400).send({ status: false, message: "Not a valid prize" })
    }

    priceGreaterThan = Number(priceGreaterThan)
    priceLessThan = Number(priceLessThan)
    let filterProduct = await productModel.find({ isDeleted: false, title: name, $or: [{ price: { $gt: priceGreaterThan } }, { price: { $lt: priceLessThan } }, { $and: [{price: {$gt: priceGreaterThan} }, { price:{$lt: priceLessThan} }] }] }).sort({ price: 1 })

    if (!isValidBody(filterProduct)) return res.status(404).send({ status: false, message: "Product not found" })

    if (filterProduct) {
      return res.status(200).send({ status: true, message: "successfull", data: filterProduct })
    }

  }


}

module.exports = {createProduct,getProduct}

