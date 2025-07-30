import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// ✅ Helper to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token will expire in 7 days
  });
};

export const registerUser = async (req, res) => {
  try {
   
    const { name, phone, location } = req.body;

    // 🛡️ Check if phone already exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }

    // ✅ Validate complete location
    if (
      !location ||
      typeof location.latitude !== 'number' ||
      typeof location.longitude !== 'number' ||
      !location.name
    ) {
      return res.status(400).json({
        error: 'Complete location (name, latitude, longitude) is required.',
      });
    }

    // 🧾 Create user
    user = await User.create({ name, phone, location });

    // 🔑 Generate token
    const token = generateToken(user._id);
    

    // ✅ Send response
   res.status(201).json({
  success: true,
  data: {
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      location: user.location,
    },
    token,
  },
  message: 'User registered successfully',
});

   
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
//getCurrentUser
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is set in req.user by auth middleware
    const user = await User.findById(userId).select('-__v -password'); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching current user:", err.message);
    res.status(500).json({ error: err.message });
  }
};
