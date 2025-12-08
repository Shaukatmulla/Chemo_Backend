const express = require("express");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");  // FIXED
const Doctor = require("../models/Doctor");
const auth = require("../middleware/auth");

const router = express.Router();

// Create Appointment
router.post("/", async (req, res) => {
  try {
    const { whatsappNumber, fullName, doctorId, appointmentDate, treatmentType, notes } = req.body;

    if (!whatsappNumber || !fullName || !doctorId || !appointmentDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let patient = await Patient.findOne({ whatsappNumber });
    if (!patient) {
      patient = await Patient.create({ whatsappNumber, fullName });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      appointmentDate: new Date(appointmentDate),
      treatmentType,
      notes
    });

    res.status(201).json({ message: "Appointment created", appointment });

  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "fullName whatsappNumber")
      .populate("doctor", "name specialization")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Updatde status (Doctor only)
router.patch("/:id/status", auth(["DOCTOR"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"];
    if (!allowedStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.json({ message: `Status updated to ${status}`, appointment });

  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reschedule (Doctor + Staff)
router.patch("/:id/reschedule", auth(["DOCTOR", "STAFF"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, notes } = req.body;

    if (!newDate) return res.status(400).json({ message: "newDate is required" });

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.appointmentDate = new Date(newDate);
    appointment.status = "RESCHEDULED";
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.json({ message: "Appointment rescheduled", appointment });

  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
