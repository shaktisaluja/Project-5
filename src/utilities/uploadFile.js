const aws = require("aws-sdk")

//...............................................AWS CONNECTION AND UPLOAD FILE ON S3..................................................................

aws.config.update({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_ID
  },
  region: process.env.REGION
})


let uploadFile = async (file, dirName) => {
  return new Promise(function (resolve, reject) {

    // this function will upload file to aws and return the link
    let s3 = new aws.S3({ apiVersion: process.env.API_VERSION }); // we will be using the s3 service of aws

    var uploadParams = {
      ACL: process.env.AWS_ACL,
      Bucket: process.env.BUCKET_NAME,  //HERE
      Key: `${dirName}/` + file.originalname, //HERE
      Body: file.buffer
    }


    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ "error": err })
      }
      console.log(data)
      console.log("file uploaded succesfully")
      return resolve(data.Location)
    })

  })

}



module.exports = { uploadFile}