const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Appointment = mongoose.model("Appointment");
const Constructor = mongoose.model("Constructor");
const moment = require("moment-timezone");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.use(requireAuth);

router.post("/submitAppointment", async (req, res) => {
  try {
    const { workerId, selectedDate, selectedTime } = req.body;
    const worker = await Constructor.findById(workerId);
    // console.log(worker);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found." });
    }

    const dateTimeString = `${selectedDate} ${selectedTime}`;

    const appointmentTime = moment.tz(dateTimeString, "Asia/Karachi").toDate();

    const appointment = new Appointment({
      userId: worker._id,
      appointments: [
        {
          clientId: req.user.id,
          date: new Date(selectedDate),
          time: appointmentTime,
          status: "pending",
        },
      ],
    });

    await appointment.save();

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/acceptAppointment", async (req, res) => {
  try {
    const { appointmentId } = req.body;
    // console.log(appointmentId);

    const appointment = await Appointment.findOne({
      "appointments._id": appointmentId,
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    const appointmentIndex = appointment.appointments.findIndex(
      (appt) => appt._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      return res
        .status(404)
        .json({ error: "Appointment not found in the array." });
    }

    appointment.appointments[appointmentIndex].status = "accepted";

    await appointment.save();

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/rejectAppointment", async (req, res) => {
  try {
    const { appointmentId } = req.body;
    // console.log(appointmentId);

    const appointment = await Appointment.findOne({
      "appointments._id": appointmentId,
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    const appointmentIndex = appointment.appointments.findIndex(
      (appt) => appt._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      return res
        .status(404)
        .json({ error: "Appointment not found in the array." });
    }

    appointment.appointments[appointmentIndex].status = "rejected";

    await appointment.save();

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAppointments", async (req, res) => {
  try {
    const appointemnt = await Appointment.find();

    res.send({ appointemnt });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
