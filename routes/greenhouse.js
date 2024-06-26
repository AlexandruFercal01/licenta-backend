const express = require("express");
const router = express.Router();
const sendCloudToDeviceMessage = require("../controllers/cloudToDeviceMsg");
const verifyToken = require("../middlewares/verifyToken");
const {
  getTodaySensorsData,
  getLatestValue,
  getAllSensorsData
} = require("../views/todaySensorsData");
const getWeeklySensorsData = require("../views/weeklySensorsData");
const getMonthlySensorsData = require("../views/monthlySensorsData");
const { getIO } = require('../views/socket');

function sendMessage(req, res) {
  try {
    sendCloudToDeviceMessage(JSON.stringify(req.body));
    res.status(200).json({ message: "Comanda trimisa cu succes!" });
  } catch (err) {
    res.status(500).json({ error: "Mesajul nu a putut fi trimis!" });
  }
}

router.get("/latestValue", verifyToken, async (req, res) => {
  try {
    const data = await getLatestValue();
    console.log(data);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.get("/allData", verifyToken, async (req, res) => {
  try {
    const data = await getAllSensorsData();
    console.log(data);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.get("/todayData", verifyToken, async (req, res) => {
  try {
    const data = await getTodaySensorsData();
    console.log(data);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.get("/weeklyData", verifyToken, async (req, res) => {
  try {
    const data = await getWeeklySensorsData();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.get("/monthlyData", verifyToken, async (req, res) => {
  try {
    const data = await getMonthlySensorsData();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
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
