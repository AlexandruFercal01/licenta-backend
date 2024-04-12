require("dotenv").config();
const express = require("express");
const {
  addPlantIdToFavourite,
  getAllFavouritePlantsIds,
  deletePlantFromFavourites,
} = require("../views/plants");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const message = await addPlantIdToFavourite(req.params.id);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.get("", verifyToken, async (req, res) => {
  try {
    const plants = await getAllFavouritePlantsIds();
    res.status(201).json(plants);
  } catch {
    res.status(500).json({ error: "Datele nu au putut fi preluate!" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    deletePlantFromFavourites(req.params.id);
    res.status(201).json({ message: "Planta a fost stearsa!" });
  } catch (err) {
    res.status(500).json({ error: "Planta nu a putut fi stearsa!" });
  }
});

module.exports = router;
