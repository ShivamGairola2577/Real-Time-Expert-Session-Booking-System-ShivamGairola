import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  timeSlots: [{ type: String }]
});

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true },
    availableSlots: [slotSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Expert", expertSchema);
