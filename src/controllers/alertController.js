// services/alertAnalyzer.js
import SensorReading from '../models/SensorReading.js';
import User from '../models/User.js';
import { interpretWithGemini } from '../services/geminiService.js';
import { sendSMS } from '../services/alertService.js';

export const analyzeAndAlert = async (io) => {
  try {
    const latestReading = await SensorReading.findOne().sort({ createdAt: -1 });
    if (!latestReading) return;

    const user = await User.findOne({ phone: latestReading.phone });
    if (!user) return;

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

    const interpretation = await interpretWithGemini(combinedData);
    console.log("AI Interpretation:", interpretation);  
    if (!interpretation.toLowerCase().includes("no flood risk")) {
      await sendSMS(interpretation, [user.phone]);
      if (io) {
        io.emit('alert', { phone: user.null, message: interpretation });
        

      }
    }
  } catch (err) {
    console.error("AI analysis error:", err.message);
  }
};
