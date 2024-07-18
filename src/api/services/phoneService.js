const twilio = require('twilio');
const config = require('../../config/appConfig');
const userModel = require('../models/userModel');
const verificationModel = require('../models/verificationCodeModel')

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const addPhoneNumber = async (userId, phoneNumber) => {
  // Save phone number to the user
  await userModel.updatePhoneNumber(userId, phoneNumber);

  // Generate and send verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  await sendSms(phoneNumber, `Your verification code is ${verificationCode}`);

  // Save verification code in the database (you can adjust as per your logic)
  await verificationModel.saveVerificationCode(userId, verificationCode);
};


const verifyPhoneNumber = async (userId, code) => {
  const verificationRecord = await verificationModel.getVerificationCode(userId);
  if (verificationRecord && verificationRecord.code === code) {
    await userModel.verifyPhoneNumber(userId);
    await verificationModel.deleteVerificationCode(userId);
    return true;
  }
  return false;
};

const sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    console.log(`Message sent: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
};

module.exports = {
  addPhoneNumber,
  verifyPhoneNumber,
};
