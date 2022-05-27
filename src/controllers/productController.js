const productModel = require("../models/productModel")
const { validateStreet, isValidBody, isValidCurrency, isValidCurrencyFormat, isValidSize, isValidNumber, isValid, isFileImage, isValidBoolean, isValidObjectId } = require("../utilities/validation");
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
    console.log(typeof(price))
    if (!isValidNumber(price)) {
        console.log(isValidNumber(price))

      return res.status(400).send({ status: false, message: "Invalid Price Format" });
    }
    console.log(isValidNumber(price))
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

    if (isFreeShipping == "" || isFreeShipping) {
      if (!isValidBoolean(isFreeShipping)) {
        return res.status(400).send({ status: false, message: "Invalid isFreeShipping Format.It must be true or false" });
      }
    }

    if (style == "" || style) {
      if (!validateStreet(style)) {
        return res.status(400).send({ status: false, message: "Invalid Style Format", });
      }
    }

    if (data.availableSizes) {
      if (!isValidSize(availableSizes)) {
        return res.status(400).send({ status: false, message: "AvailableSizes should be of S,XS,M,X,L,XXL,XL" });
      }
      data.availableSizes = data.availableSizes.trim().split(",").map(ele => ele.trim())
    }


    if (installments == "" || installments) {
      if (!isValidNumber(installments)) {
        return res.status(400).send({ status: false, message: "Invalid installments Format" });
      }
    }

    if (isDeleted) {
      if (!isValidBoolean(isDeleted)) {
        return res.status(400).send({ status: false, message: "Invalid input of isDeleted.It must be true or false " });
      }
      if (isDeleted == "true" || isDeleted == true) {
        return res.status(400).send({ status: false, message: "isDeleted must be false while creating Product" });
      }
    }

    if (!req.files) {
      return res.status(400).send({ msg: "File is Required" })
    }
    let files = req.files
    if (!files.length) return res.status(400).send({ msg: "File is Required" })
    let check = isFileImage(files[0])
    if (!check) return res.status(400).send({ status: false, message: 'Invalid file, image only allowed' })
    let dirName = "productImage_v01";
    let uploadedFileURL = await uploadFile(files[0], dirName)
    if (!uploadedFileURL) return res.status(404).send({ status: false, message: 'No file found' })
    data.productImage = uploadedFileURL

    const product = await productModel.create(data);
    return res.status(201).send({ status: true, message: "Product created successfully", data: product });

  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}


const getProduct = async function (req, res) {

  try {
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

      const filter = { isDeleted: false }

      if (size == "" || size) {
        if (!isValidSize(size)) return res.status(400).send({ status: false, message: "Not a valid size" })
        let sizeArr = size.trim().split(",").map(ele => ele.trim())
        filter["availableSizes"] = { $all: sizeArr }
      }

      if (name == "" || name) {
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Not a valid name" })
        filter["title"] = name;
      }

      if (priceGreaterThan == "" || (priceGreaterThan && !priceLessThan)) {
        if (!isValidNumber(priceGreaterThan)) return res.status(400).send({ status: false, message: "Not a valid prize" })
        filter["price"] = { $gt: Number(priceGreaterThan) }
      } else if (priceLessThan == "" || (priceLessThan && !priceGreaterThan)) {
        if (!isValidNumber(priceLessThan)) return res.status(400).send({ status: false, message: "Not a valid prize" })
        filter["price"] = { $lt: Number(priceLessThan) };
      } else if (priceGreaterThan && priceLessThan) {
        filter["price"] = { $gt: Number(priceGreaterThan), $lt: Number(priceLessThan) }
      }

      const filterProduct = await productModel.find(filter).sort({ price: 1 })
      if (!isValidBody(filterProduct)) return res.status(404).send({ status: false, message: "Product not found" })

      return res.status(200).send({ status: true, message: "Success", data: filterProduct })

    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }

}



const deleteProduct = async function (req, res) {
  try {

    const productId = req.params.productId

    if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Not a valid product id" })

    const deleteProduct = await productModel.findOneAndUpdate({ isDeleted: false, _id: productId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

    if (!deleteProduct) return res.status(404).send({ status: false, message: "Product not found" })

    return res.status(200).send({ status: true, message: "Success", data: deleteProduct })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }

}

const getProductsById = async function (req, res) {
  try {
    let productId = req.params.productId

    if (!isValidObjectId(productId)) {
      return res.status(400).send({ status: false, message: "Product ID is Not Valid" });
    }

    const result = await productModel.findOne({ _id: productId, isDeleted: false })
   
    if (!result) {
      return res.status(404).send({ status: false, message: " Product Not found" })
    }
    res.status(200).send({ status: true, message: "Product", data: result })
  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}



module.exports = { createProduct, getProduct, deleteProduct ,getProductsById}

