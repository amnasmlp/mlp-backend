const phoneService = require('../services/phoneService');

const addPhoneNumber = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phoneNumber } = req.body;
    await phoneService.addPhoneNumber(userId, phoneNumber);

    res.status(200).json({ message: 'Verification code sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyPhoneNumber = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;
    const verified = await phoneService.verifyPhoneNumber(userId, code);
    if (verified) {
      res.status(200).json({ message: 'Phone number verified' });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addPhoneNumber,
  verifyPhoneNumber,
};
