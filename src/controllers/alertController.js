// controllers/alertController.js
import SensorReading from '../models/SensorReading.js';
import User from '../models/User.js';
import { interpretWithGemini } from '../services/geminiService.js';
import { sendSMS } from '../services/alertService.js';

export const analyzeAndAlert = async (req, res) => {
  try {
    // Find the latest reading
    const latestReading = await SensorReading.findOne().sort({ createdAt: -1 });
    if (!latestReading) {
      return res.status(404).json({ error: "No sensor data found." });
    }

    // Find user by phone (ensure phone is stored with reading)
    const user = await User.findOne({ phone: latestReading.phone });
    if (!user) {
      return res.status(404).json({ error: "User not found for this phone number." });
    }

    const combinedData = {
      temperature: latestReading.temperature,
      humidity: latestReading.humidity,
      waterLevel: latestReading.waterLevel,
      rainSensor: latestReading.rainSensor,
      locationInfo: {
        latitude: user.location.latitude || 0.2900289,
        longitude: user.location.longitude || 34.7833,
        name: user.location.name || "Unknown area",
      },
    };

    // AI interpretation
    const interpretation = await interpretWithGemini(combinedData);

    // Update reading with interpretation
    // latestReading.interpretation = interpretation;
    // await latestReading.save();

    // Send alert if needed
    if (!interpretation.toLowerCase().includes("no flood risk")) {
      await sendSMS(interpretation, [user.phone]);
      req.io.emit('alert', { phone: user.phone, message: interpretation });
    }

    res.status(200).json({ success: true, message: interpretation });
  } catch (err) {
    console.error("AI analysis error:", err);
    res.status(500).json({ error: err.message });
  }
};
