const express = require('express');
const multer = require('multer')
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();


console.log(process.env.PORT)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

mongoose.connect("mongodb+srv://Laxmi_Dobhal:MPY5xYd5tUMu48w2@cluster0.su5lt.mongodb.net/group3Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});