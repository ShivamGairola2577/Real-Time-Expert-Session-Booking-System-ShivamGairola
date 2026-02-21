import Booking from "../models/Booking.js";
import Expert from "../models/Expert.js";
import { getIO } from "../socket/socket.js";

export const createBooking = async (req, res, next) => {
  try {
    const { expertId, email, date, timeSlot } = req.body;

    const booking = await Booking.create(req.body);

    // Remove booked time slot from expert
    const expert = await Expert.findById(expertId);

    expert.availableSlots = expert.availableSlots.map((slot) => {
      if (slot.date === date) {
        slot.timeSlots = slot.timeSlots.filter(
          (t) => t !== timeSlot
        );
      }
      return slot;
    });

    await expert.save();

    // Emit real-time update
    const io = getIO();
    io.to(expertId).emit("slotUpdated", { expertId });

    res.status(201).json(booking);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "This slot is already booked." });
    }
    next(error);
  }
};

export const getBookingsByEmail = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      email: req.query.email
    }).populate("expertId", "name category");

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};
