import SensorReading from '../models/SensorReading.js';
import { analyzeAndAlert } from './alertController.js';

export const saveSensorData = async (req, res) => {
  try {
    const { temperature, humidity, waterLevel, rainSensor, phone } = req.body;

    if (
      temperature == null ||
      humidity == null ||
      waterLevel == null ||
      rainSensor == null ||
      !phone
    ) {
      return res.status(400).json({ error: "Missing sensor data or phone." });
    }

    // Save reading to DB (with phone)
    const reading = await SensorReading.create({
      temperature,
      humidity,
      waterLevel,
      rainSensor,
      phone,
    });
    // Pass `io` to be used for real-time alert
   await analyzeAndAlert(req.io);

    // Prepare data to broadcast (exclude phone)
    const dataToBroadcast = { temperature, humidity, waterLevel, rainSensor };

   

    // Emit directly from request body (without phone)
    req.io.emit('sensor-data', dataToBroadcast);

    res.status(201).json({ success: true, reading });
  } catch (err) {
    console.error("Error saving sensor data:", err);
    res.status(500).json({ error: err.message });
  }
};
