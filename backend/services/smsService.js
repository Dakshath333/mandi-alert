const twilio = require('twilio');

/**
 * SMS Service using Twilio
 * Falls back to simulation mode if Twilio credentials are not configured
 */
const sendSMS = async (toPhone, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  // Check if Twilio is configured
  if (!accountSid || !authToken || !fromPhone ||
      accountSid === 'your_twilio_account_sid') {
    // Simulation mode - log the SMS instead
    console.log('📱 [SMS SIMULATED]');
    console.log(`   To: ${toPhone}`);
    console.log(`   Message: ${message}`);
    return { success: false, simulated: true };
  }

  try {
    const client = twilio(accountSid, authToken);

    // Format phone number - ensure it starts with country code
    const formattedPhone = toPhone.startsWith('+') ? toPhone : `+91${toPhone}`;

    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedPhone,
    });

    console.log(`✅ SMS sent to ${toPhone}: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error(`❌ SMS failed to ${toPhone}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
