// Import the aws-sdk
const AWS = require('aws-sdk');

// Modify the AWS config object that DynamoDB will use to connect to the local instance
AWS.config.update({
    region: 'us-east-2',
});

// Create the DynamoDB service object 
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// Create a params object that will hold the schema and metadata of the table
const params = {
    // Designate the table name
    TableName: 'Thoughts',
    // Define the partition key and the sort key
    KeySchema: [
        { AttributeName: 'username', KeyType: 'HASH' }, // Partition Key
        { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort Key
    ],
    // This is a property that defines the attributes we've used for the hash and range keys. We must assign a data type to the attributes we've declared. We assing a string to the username and a number to createdAt
    AttributeDefinitions: [
        { AttributeName: 'username', AttributeType: 'S' }, // String
        { AttributeName: 'createdAt', AttributeType: 'N' }, // Number
    ],
    // This is a property with settings that reserve a maximum write and read capacity of the database, which is how AWS factors in pricing
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
};

dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error(
            'Unable to create table. Error JSON:',
            JSON.stringify(err, null, 2),
        );
    } else {
        console.log(
            'Created table. Table description JSON:',
            JSON.stringify(data, null, 2),
        );
    }
});