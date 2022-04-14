// import express
const express = require('express');

// use router() from express library
const router = express.Router();

// install the aws-sdk package, then import aws-sdk and configure the service interface object, dynamodb
const AWS = require('aws-sdk');
const awsConfig = {
    region: 'us-east-2',
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

// Create the get route to access all thoughts
router.get('/users', (req, res) => {
    const params = {
        TableName: table,
    };
    // Scan return al itmes in the table
    dynamodb.scan(params, (err, data) => {
        if (err) {
            res.status(500).json(err); // an error occurred
        } else {
            res.json(data.Items);
        }
    });
});

router.get('/users/:username', (req, res) => {
    console.log(`Querying for thought(s) from ${req.params.username}.`);
    const params = {
        TableName: table,
        ProjectionExpression: '#th, #ca',
        KeyConditionExpression: '#un = :user',
        ExpressionAttributeNames: {
            '#un': 'username',
            '#ca': 'createdAt',
            '#th': 'thought',
            '#img': 'image',
        },
        ExpressionAttributeValues: {
            ':user': req.params.username,
        },
        ProjectionExpression: '#un, #th, #ca, #img',
        ScanIndexForward: false,
    };
    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded!");
            res.json(data.Items)
        }
    });
});

// Create new user at /api/users
router.post('/users', (req, res) => {
    const params = {
        TableName: table,
        Item: {
            username: req.body.username,
            createdAt: Date.now(),
            thought: req.body.thought,
            image: req.body.image,
        },
    };
    // database call
    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).json(err); // an error occurred
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.json({"Added": JSON.stringify(data, null, 2)});
        }
    });
});

module.exports = router;