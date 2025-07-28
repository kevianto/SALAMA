import User from '../models/User.js';
import jwt from 'jsonwebtoken';
export const registerUser = async (req, res) => {
  try {
    const { name, phone, location } = req.body; // ⬅️ Include location

    // Check if phone already exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }

    // Validate that location contains all required fields
    if (!location || !location.latitude || !location.longitude || !location.name) {
      return res.status(400).json({ error: 'Complete location (latitude, longitude, name) is required.' });
    }

    // Create new user with location
    user = await User.create({ name, phone, location });
// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d' // token will expire in 7 days
  });
};
    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        location: user.location,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
