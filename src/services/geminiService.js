import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


export const interpretWithGemini = async (combinedData) => {
  const prompt = `
You are an AI assistant helping prevent flood disasters along River Nzoia in Kenya.

A user has submitted the following:

**Sensor Readings**
- Temperature: ${combinedData.temperature} °C
- Humidity: ${combinedData.humidity} %
- Water Level: ${combinedData.waterLevel} cm
- Rain Sensor Value: ${combinedData.rainSensor}

**User Location:**
- Place name: ${combinedData.locationInfo.name}
- GPS coordinates: (${combinedData.locationInfo.latitude}, ${combinedData.locationInfo.longitude})

Your task:
1. Analyze if there is a flood risk in this location, considering proximity to River Nzoia and general flood-prone geography in western Kenya.
2. If the user is in a **low-risk area**, respond with: “No flood risk at your location.”
3. If the user is in a **high-risk or low-lying zone**, generate a short alert message (2–3 sentences) explaining:
   - Why the user is at risk
   - What safety action they should take (e.g. evacuate)
   - Optionally, suggest nearby higher ground if known

Respond only with the message to be sent to the user.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.status, error.response?.data || error.message);
    throw new Error('AI interpretation failed.');
  }
};
