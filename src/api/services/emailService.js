// emailService.js

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendActivationEmail = async (email, username, activationToken) => {
  try {
    const activationEmailTemplatePath = path.join(__dirname, '../../email_templates/activation_email.html');
    const emailTemplate = fs.readFileSync(activationEmailTemplatePath, 'utf8');

    const activationLink = `${process.env.CLIENT_SIDE_URL}user/activate/${activationToken}`;

    const html = emailTemplate
      .replace(/{{ username }}/g, username)
      .replace(/{{ activationLink }}/g, activationLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Activate Your Account',
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Activation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending activation email to ${email}: ${error.message}`);
  }
};

module.exports = {
  sendActivationEmail,
};
