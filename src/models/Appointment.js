const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED", "RESCHEDULED", "CANCELLED"],
      default: "PENDING"
    },
    treatmentType: { type: String },
    notes: { type: String },
    createdVia: { type: String, enum: ["WHATSAPP", "MANUAL"], default: "WHATSAPP" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
