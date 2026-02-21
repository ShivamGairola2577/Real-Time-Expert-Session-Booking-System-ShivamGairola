import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true
    },
    name: String,
    email: { type: String, required: true },
    phone: String,
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      default: "Confirmed"
    }
  },
  { timestamps: true }
);

// Prevent double booking
bookingSchema.index(
  { expertId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

export default mongoose.model("Booking", bookingSchema);
