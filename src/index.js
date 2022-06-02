require("dotenv").config()
const express = require('express');
const multer = require('multer')
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();


console.log(process.env.PORT)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

mongoose.connect(process.env.CONNECTION_STRING_MDB, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});