const aws = require('aws-sdk')

let uploadFile =async (file) => {

    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) 

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "User_V01" + file.originalname,
            Body: file.buffer,
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "Error": err })
            }
            console.log(data)
            console.log("File uploaded sucesfully")
            return resolve(data)
        })
    })

}

let registerUser = async function (req, res) {
    let file = req.files
    if(file && file.length>0){
    let getUploadedFileUrl = await uploadFile(file[0])
    return res.status(201).send({ status: true, data: getUploadedFileUrl })
    } else {
        return res.status(404).send({ status: false, data: getUploadedFileUrl })
    }
}


module.exports = { registerUser }