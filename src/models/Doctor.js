const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, default: "Oncologist" },
    email: { type: String },
    phone: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
