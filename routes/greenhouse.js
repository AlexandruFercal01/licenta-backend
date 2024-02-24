const express = require("express");
const router = express.Router();
const sendCloudToDeviceMessage = require("../controllers/cloudToDeviceMsg");
const verifyToken = require("../middlewares/verifyToken");

function sendMessage(req, res) {
  try {
    sendCloudToDeviceMessage(JSON.stringify(req.body));
    res.sendStatus(200).json({ message: "Command sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Command failed" });
  }
}

router.post("/fan/:id", verifyToken, (req, res) => {
  sendMessage(req, res);
});

router.post("/pump", verifyToken, (req, res) => {
  sendMessage(req, res);
});

router.post("/servo", verifyToken, (req, res) => {
  sendMessage(req, res);
});

module.exports = router;
