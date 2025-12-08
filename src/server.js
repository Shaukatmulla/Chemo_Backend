require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const doctorRoutes = require("./routes/doctorRoutes.js");
const appointmentRoutes = require("./routes/appointmentRoutes.js");
const authRoutes = require("./routes/authRoutes.js");




const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Chemotherapy Appointment API Running" });
});

// API Routes

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
