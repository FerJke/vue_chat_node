const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.SERVICE_ACCOUNT,
    "project_id":  process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_CERT_URI,
    "client_x509_cert_url": process.env.CLIENT_CERT_URI
  }),
  databaseURL: process.env.DATABASE_URL
});

module.exports = admin;
