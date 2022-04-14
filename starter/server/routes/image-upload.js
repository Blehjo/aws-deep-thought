const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');

const paramsConfig = require('../utils/params-config');

// Instantiate the service object, S3, to communicate with the S3 web service, which will allow us to upload the image to the S3 bucket.
// Lock the version number as a precautionary measure in case the default S3 version changes.  This way the code we write has a lower chance of breaking due to default version changes to the API.
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
});

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    },
});

// image is the key!
// Use the preceding function, upload, to store the image data from the form data received by the post route.  We'll use the single method to define that this upload function will receive only one image. We'll also define the key of the image object as image.
const upload = multer({ storage }).single('image');


// Endpoint will be located at localhost:3000/api/image-upload.
// We'll use a POST method to securely transfer the request body.
// We include the upload function as the second argument to define the key and storage destination.
// In the route's function block we need to configure params, so that the S3 will know the bucket name as well as the image's file name
router.post('/image-upload', upload, (req, res) => {
    // set up params config
    const params = paramsConfig(req.file);
    // set up S3 service call
    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        res.json(data);
    });
});

module.exports = router;