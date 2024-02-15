const express = require("express");
const router = express.Router();
const sendCloudToDeviceMessage = require("../controllers/cloudToDeviceMsg");

router.post("/fan/:id", (req, res) => {
  sendCloudToDeviceMessage(JSON.stringify(req.body), res);
});

router.post("/pump", (req, res) => {
  sendCloudToDeviceMessage(JSON.stringify(req.body), res);
});

router.post("/servo", (req, res) => {
  sendCloudToDeviceMessage(JSON.stringify(req.body), res);
});

module.exports = router;
