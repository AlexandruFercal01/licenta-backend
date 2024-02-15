("use strict");

var Client = require("azure-iothub").Client;
var Message = require("azure-iot-common").Message;
require("dotenv").config();

var connectionString = process.env.IOT_HUB_CONN;
var targetDevice = process.env.DEVICE_ID;

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + " error: " + err.toString());
    if (res) console.log(op + " status: " + res.constructor.name);
  };
}

function receiveFeedback(err, receiver) {
  receiver.on("message", function (msg) {
    console.log("Feedback message:");
    console.log(msg.getData().toString("utf-8"));
  });
}

function sendCloudToDeviceMessage(message, res) {
  serviceClient.open(function (err) {
    if (err) {
      console.error("Could not connect: " + err.message);
      console.log(err);
    } else {
      console.log("Service client connected");
      serviceClient.getFeedbackReceiver(receiveFeedback);
      var msg = new Message(message);
      console.log("Sending message: " + msg.getData());
      serviceClient.send(targetDevice, msg);
      res.sendStatus(200);
    }
  });
}

module.exports = sendCloudToDeviceMessage;
