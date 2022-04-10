// Import the aws-sdk
const AWS = require('aws-sdk');

// File system package to read the users.json file
const fs = require('fs');

// Modify the AWS config object that DynamoDB will use to connect to the local instance
AWS.config.update({
    region: 'us-east-2',
});

// We use the DocumentClient() class this time to create the dunamodb service object.  This class offers a level of abstraction that enables us to use JavaScript objects as arguments and return native JavaScript types. This constructor helps map objects, which reduces impedance mismatching and speeds up the development process.
const dynamodb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
});

console.log('Importing thoughts into DynamoDB. Please wait.');
const allUsers = JSON.parse(
    fs.readFileSync('./server/seed/users.json', 'utf8'),
);

// Loop over allUsers array and create the params object with the lemenets in the array 
allUsers.forEach(user => {
    const params = {
        TableName: "Thoughts",
        Item: {
            "username": user.username,
            "createdAt": user.createdAt,
            "thought": user.thought
        }
    };
    // Make a call to the database with the service interface object, dynamodb
    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add thought", user.usernam, ", Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", user.username);
        }
    });
});

