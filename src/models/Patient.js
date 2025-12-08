const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    whatsappNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    uhid: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
