import africastalking from 'africastalking';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Africa's Talking
const AT = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = AT.SMS;

/**
 * Sends an SMS message to one or more recipients.
 *
 * @param {string[]} recipients - Array of phone numbers (e.g., ['+254712345678'])
 * @param {string} message - The SMS message content
 */
export async function sendSMS(recipients, message) {
  try {
    if (!sms) {
      throw new Error('AfricasTalking SMS service not initialized');
    }

    const result = await sms.send({
      to: recipients,
      message: message,
      // from: 'AFRICASTKNG' // Optional: Only if you have a registered sender ID
    });

    console.log("✅ SMS sent:", result);
    return result;
  } catch (err) {
    console.error("❌ SMS sending error:", err.message || err);
    throw err;
  }
}
