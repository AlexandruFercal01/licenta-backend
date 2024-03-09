const express = require("express");
const router = express.Router();
const sendCloudToDeviceMessage = require("../controllers/cloudToDeviceMsg");
const verifyToken = require("../middlewares/verifyToken");
const {
  getTodaySensorsData,
  getLatestValue,
} = require("../views/todaySensorsData");
const getWeeklySensorsData = require("../views/weeklySensorsData");
const getMonthlySensorsData = require("../views/monthlySensorsData");

function sendMessage(req, res) {
  try {
    sendCloudToDeviceMessage(JSON.stringify(req.body));
    res.sendStatus(200).json({ message: "Command sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Command failed" });
  }
}

router.get("/latestValue", verifyToken, (req, res) => {
  try {
    const data = getLatestValue();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Command failed" });
  }
});

router.get("/todayData", verifyToken, (req, res) => {
  try {
    const data = getTodaySensorsData();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Command failed" });
  }
});

router.get("/weeklyData", verifyToken, (req, res) => {
  try {
    const data = getWeeklySensorsData();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Command failed" });
  }
});

router.get("/monthlyData", verifyToken, (req, res) => {
  try {
    const data = getMonthlySensorsData();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Command failed" });
  }
});

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
