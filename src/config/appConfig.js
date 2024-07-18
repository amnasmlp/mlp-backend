module.exports = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    baseUrl: process.env.BASE_URL,
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      serviceSid: process.env.TWILIO_SERVICE_SID,
    },
  };
  