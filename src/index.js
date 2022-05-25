const express = require('express');
const multer=require('multer')
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

mongoose.connect("mongodb+srv://saurabhtripathi:knk1UnvgHtDySHWR@cluster0.qeoom.mongodb.net/Shivam-Proj-4", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

let str="abc"
str.charAt

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
