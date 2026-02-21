const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();


// ================= Middleware =================
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());


// ================= MongoDB Connection =================
mongoose.connect("mongodb://127.0.0.1:27019/signupDB")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });


// ================= User Schema =================
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    dob: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

// 🔥 Force collection = users
const User = mongoose.model("User", userSchema, "users");


// ================= Expert Schema =================
const expertSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  region: String,
  country: String,
  category: String,
  rating: Number,
  slot: Number,
  price: Number
});

// 🔥 Use existing search collection
const Expert = mongoose.model("Expert", expertSchema, "search");

// ================= Booking Schema =================
// ================= Booking Schema =================


// ================= Booking Schema =================
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true
  },
  date: { type: String, required: true },   // yyyy-mm-dd
  time: { type: String, required: true }    // HH:mm
}, { timestamps: true });

// 🔥 Rule 1: Same expert cannot be booked twice on same date + time
bookingSchema.index(
  { expertId: 1, date: 1, time: 1 },
  { unique: true }
);

// 🔥 Rule 3: Same user cannot double book same expert at same date + time
bookingSchema.index(
  { userId: 1, expertId: 1, date: 1, time: 1 },
  { unique: true }
);

const Booking = mongoose.model("Booking", bookingSchema, "bookings");
// ================= Signup Route =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, dob, username, password } = req.body;

    if (!name || !email || !dob || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      dob,
      username,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= Login Route =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= Get 10 Experts Per Category =================
app.get("/experts", async (req, res) => {
  try {
    const categories = [
      "Technology & Software Development",
      "Business Strategy & Entrepreneurship",
      "Academic Learning & Exam Preparation",
      "Fitness & Physical Training",
      "Finance & Investment Advisory",
      "Legal & Compliance Advisory"
    ];

    const result = {};

    for (let category of categories) {
      result[category] = await Expert.find({ category })
        .limit(10);
    }

    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//ADD NEW ROUTE FOR EXPERT DETAIL SCREEN
app.get("/all-experts", async (req, res) => {
  try {
    const experts = await Expert.find(); // get ALL experts
    res.status(200).json(experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Get Filter Options =================
app.get("/filter-options", async (req, res) => {
  try {
    const categories = await Expert.distinct("category");
    const regions = await Expert.distinct("region");
    const countries = await Expert.distinct("country");
    const ratings = await Expert.distinct("rating");
    const prices = await Expert.distinct("price");
    const slots = await Expert.distinct("slot");

    res.status(200).json({
      categories: categories.sort(),
      regions: regions.sort(),
      countries: countries.sort(),
      ratings: ratings.sort((a, b) => a - b),
      prices: prices.sort((a, b) => a - b),
      slots: slots.sort((a, b) => a - b)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Filter Experts =================
// ================= Filter Experts =================
app.get("/filter-experts", async (req, res) => {
  try {
    const {
      search,
      category,
      region,
      country,
      minRating,
      maxPrice,
      minSlot
    } = req.query;

    let filter = {};

    // 🔍 Search by name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) filter.category = category;
    if (region) filter.region = region;
    if (country) filter.country = country;

    if (minRating)
      filter.rating = { $gte: Number(minRating) };

    if (maxPrice)
      filter.price = { $lte: Number(maxPrice) };

    if (minSlot)
      filter.slot = { $gte: Number(minSlot) };

    const experts = await Expert.find(filter);

    res.status(200).json(experts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// ================= Book Expert =================
// ================= Book Expert =================
// ================= Book Expert =================
// ================= Book Expert =================
app.post("/book", async (req, res) => {
  try {
    const { userId, expertId, date, time } = req.body;

    if (!userId || !expertId || !date || !time) {
      return res.status(400).json({ message: "Date and Time required" });
    }

    const expert = await Expert.findById(expertId);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    if (expert.slot <= 0) {
      return res.status(400).json({ message: "No slots available" });
    }

    // 🔥 Try creating booking
    await Booking.create({
      userId,
      expertId,
      date,
      time
    });

    // Reduce slot only after booking success
    expert.slot -= 1;
    await expert.save();

    res.status(200).json({
      message: "Booking successful",
      updatedSlot: expert.slot
    });

  } catch (error) {

    // 🔥 Duplicate booking error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This time slot is already booked"
      });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= Get Booking History =================
app.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .populate("expertId", "name category price")
      .sort({ createdAt: -1 });

    const now = new Date();

    const formatted = bookings.map(b => {

      const bookingDateTime = new Date(`${b.date}T${b.time}`);

      const status =
        bookingDateTime < now ? "Completed" : "Confirmed";

      return {
        _id: b._id,
        expertName: b.expertId.name,
        category: b.expertId.category,
        price: b.expertId.price,
        date: b.date,
        time: b.time,
        status
      };
    });

    res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// ================= Server =================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
