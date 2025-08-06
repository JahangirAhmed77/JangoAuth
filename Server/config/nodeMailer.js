import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.BREVO_API_KEY;
const apiUrl = 'https://api.brevo.com/v3/smtp/email';
const senderName = 'JangoAuth';

const brevoConfig = {
  sendBrevoEmail: async (mailOptions) => { // Accept mailOptions
    try {
      await axios.post(
        apiUrl,
        {
          sender: { name: senderName, email: mailOptions.from },
          to: [{ email: mailOptions.to }],
          subject: mailOptions.subject,
          textContent: mailOptions.text,
          htmlContent: mailOptions.html, // <-- ADD THIS LINE
        },
        {
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        }
      );
      console.log('Brevo email sent successfully:', mailOptions.to);
    } catch (error) {
      console.error('Error sending Brevo email:', error);
      throw error;
    }
  },
};

export default brevoConfig;