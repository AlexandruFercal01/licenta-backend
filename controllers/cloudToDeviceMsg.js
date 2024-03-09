("use strict");

var Client = require("azure-iothub").Client;
var Message = require("azure-iot-common").Message;
require("dotenv").config();

var connectionString = process.env.IOT_HUB_CONN;
var targetDevice = process.env.DEVICE_ID;

var serviceClient = Client.fromConnectionString(connectionString);

function receiveFeedback(err, receiver) {
  receiver.on("message", function (msg) {
    console.log("Feedback message:");
    console.log(msg.getData().toString("utf-8"));
  });
}

function sendCloudToDeviceMessage(message) {
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
    }
  });
}

module.exports = sendCloudToDeviceMessage;
