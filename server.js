'use strict';

var http = require('http');
var consumer = require('sqs-consumer');

var queueUrl = process.env['QUEUEURL'];
var region = process.env['REGION'];
var kettleApiHost = process.env['KETTLEAPIHOST'];
var kettleApiPort = process.env['KETTLEAPIPORT'];

if (!queueUrl) {
  console.log('QUEUEURL not set.');
  process.exit(1);
  return;
}

if (!region) {
  console.log('REGION not set.');
  process.exit(1);
  return;
}

if (!kettleApiHost) {
  console.log('KETTLEAPIHOST not set.');
  process.exit(1);
  return;
}

if (!kettleApiPort) {
  console.log('KETTLEAPIPORT not set.');
  process.exit(1);
  return;
}

var app = consumer.create({
  queueUrl: queueUrl,
  region: 'us-east-1',
  waitTimeSeconds: 20,
  handleMessage: function (message, done) {
    var body;
    
    try {
      body = JSON.parse(message.Body);
    } catch (e) {
      console.log('Error parsing json message body: ' + message.Body);
      done();
      return;
    }
    
    if (!body.command) {
      console.log('command not found in message body.');
      done();
      return;
      
    }
    console.log('Received command ' + body.command);
    
    switch (body.command) {
      case "boil":
        kettleApiRequest('/boil');
        break;
        
      case "off":
        kettleApiRequest('/off');
        break;
        
      case "keepwarm":
        kettleApiRequest('/keepwarm');
        break;
        
      default:
        console.log('Unrecognized or unsupported command.');
        break;
    }
    
    done();
  }
})

app.on('error', function (err) {
  console.log(err.message);
});

app.start();

function kettleApiRequest(path) {
  var request = http.request({
    hostname: kettleApiHost,
    port: kettleApiPort,
    method: 'POST',
    path: path
  }, function (response) {
    var body = '';
    
    response.on('data', function (data) {
      body += data;
    });
    
    response.on('end', function () {
      console.log(body);
    });
  });
  
  request.on('error', function (error) {
    console.log('Error sending request to ' + path + ': ' + error.message);
  });

  request.end();
}