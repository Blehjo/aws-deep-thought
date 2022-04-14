// Load the AWS SDK (Software Development Kit) for Node.js
const AWS = require('aws-sdk');

// Used to create a unique Simple Storage Service (S3) bucket name
const { v4: uuidv4 } = require('uuid');

// Set the region
AWS.config.update({ region: 'us-east-2' });
// The region must be updated to communicate with the web service

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// The preceding expression creates the S3 instance object with the designated API.  By specifiying the API version, we ensure that the API library we're using is compatible with the following commands

// Create the paramters for calling createBucket
// Assigns the metadata of the bucket (such as the bucket name)
var bucketParams = {
    Bucket: 'user-images-' + uuidv4(),
};

// Call the s3 instance object to create an S3 bucket using the bucketParams- by adding the following code
s3.createBucket(bucketParams, (err, data) => {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Success!');
    }
});

// npm install aws-sdk uuid
