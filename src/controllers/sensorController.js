// controllers/sensorController.js
import SensorReading from '../models/SensorReading.js';

export const saveSensorData = async (req, res) => {
  try {
    const { temperature, humidity, waterLevel, rainSensor, phone } = req.body;

    // Validate required fields
    if (
      temperature == null ||
      humidity == null ||
      waterLevel == null ||
      rainSensor == null ||
      !phone
    ) {
      return res.status(400).json({ error: "Missing sensor data or phone." });
    }

    // Save sensor reading without interpretation
    const reading = await SensorReading.create({
      temperature,
      humidity,
      waterLevel,
      rainSensor,
      phone,
    });

    res.status(201).json({ success: true, reading });
  } catch (err) {
    console.error("Error saving sensor data:", err);
    res.status(500).json({ error: err.message });
  }
};
