const { v4: uuidv4 } = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        // Replace the <My_Bucket_Name> with the name of your own S3 bucket
        Bucket: 'user-images-044fd03c-d645-4918-b799-66e5abb35b5b',
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer,
        ACL: 'public-read', // allow read access to this file
    };

    return imageParams;
};

module.exports = params;