import africastalking from 'africastalking';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Africa's Talking
const AT = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = AT.SMS; // ✅ Correctly reference the initialized SMS service

// recipients should be passed in as a parameter or declared
const recipients = ['+254712345678']; // 🔁 Replace with real number(s)
const message = '🚨 Flood Alert: Heavy rainfall and high water levels detected. Please evacuate low-lying areas immediately.';

export async function sendSMS() {
  try {
    if (!sms) {
      throw new Error('AfricasTalking SMS service not initialized');
    }

    const result = await sms.send({
      to: recipients,
      message: message,
      // from: 'AFRICASTKNG' // ✅ optional, only if approved sender ID
    });

    console.log("SMS sent:", result);
  } catch (err) {
    console.error("SMS error:", err);
  }
}
