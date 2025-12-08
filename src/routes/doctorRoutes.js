const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Create a doctor
router.post("/", async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Error creating doctor" });
  }
});

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error("Error getting doctors:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

module.exports = router;
