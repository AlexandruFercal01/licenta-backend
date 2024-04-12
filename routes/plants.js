require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../views/user");
const {
  addPlant,
  getPlant,
  getAllPlants,
  getPlantsByIds,
} = require("../views/plants");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("", verifyToken, async (req, res) => {
  const plant = req.body;
  try {
    addPlant(plant);
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.get("/:name", verifyToken, async (req, res) => {
  try {
    const plant = await getPlant(req.params.name);
    res.status(200).json(plant);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.post("/byIds", verifyToken, async (req, res) => {
  try {
    const plant = await getPlantsByIds(req.body.ids);
    res.status(200).json(plant);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.get("", verifyToken, async (req, res) => {
  try {
    const plants = await getAllPlants();
    res.status(200).json(plants);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

module.exports = router;
