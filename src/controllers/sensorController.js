import SensorReading from '../models/SensorReading.js';
import { interpretWithGemini } from '../services/geminiService.js';
import { sendSMS } from '../services/alertService.js';
import User from '../models/User.js';

export const receiveSensorData = async (req, res) => {
  try {
    const { temperature, humidity, waterLevel, rainSensor } = req.body;

    // ✅ Validate data
    if (
      temperature == null ||
      humidity == null ||
      waterLevel == null ||
      rainSensor == null
    ) {
      return res.status(400).json({ error: "Missing sensor data." });
    }

    const user = req.user; // ⬅️ Picked from middleware

    // if (!user?.location?.latitude || !user?.location?.longitude) {
    //   return res.status(400).json({ error: "User location not set." });
    // }

    const combinedData = {
      temperature,
      humidity,
      waterLevel,
      rainSensor,
      locationInfo: {
        latitude: user.location.latitude||"0.2900289",
        longitude: user.location.longitude||"34.7833",
        name: user.location.name || user.name || "Unknown area",
      },
    };

    // 🧠 AI interpretation
    const interpretation = await interpretWithGemini(combinedData);

    // 💾 Save reading
    const reading = await SensorReading.create({
      temperature,
      humidity,
      waterLevel,
      rainSensor,
      user: user._id,
      interpretation,
    });

    // 📡 Notify frontend
    req.io.emit('new-reading', reading);

    // 🚨 Alert if needed
    if (!interpretation.toLowerCase().includes("no flood risk")) {
      await sendSMS(interpretation, [user.phone]);
      req.io.emit('alert', { phone: user.phone, message: interpretation });
    }

    res.status(201).json(reading);
  } catch (err) {
    console.error("Sensor processing error:", err);
    res.status(500).json({ error: err.message });
  }
};
