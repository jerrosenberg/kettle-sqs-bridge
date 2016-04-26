'use strict';

var http = require('http');
var consumer = require('sqs-consumer');

var routes = {
};

var app = consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/017066291439/kettle-commands',
  region: 'us-east-1',
  waitTimeSeconds: 20,
  handleMessage: function (message, done) {
    var body = JSON.parse(message.Body);
    
    
    
    done();
  }
})

app.on('error', function (err) {
  console.log(err.message);
});

app.start();
