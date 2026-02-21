import express from "express";
import {
  createBooking,
  getBookingsByEmail
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookingsByEmail);

export default router;
