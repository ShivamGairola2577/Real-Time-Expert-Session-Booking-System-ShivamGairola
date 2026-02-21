import Expert from "../models/Expert.js";

export const getExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, search = "", category = "" } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const experts = await Expert.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Expert.countDocuments(query);

    res.json({
      experts,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.json(expert);
  } catch (error) {
    next(error);
  }
};
