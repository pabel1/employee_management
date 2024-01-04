const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

module.exports = {
  env: process.env.NODE_ENV,
  jwt_key: process.env.JWT_SECRET_KEY,
  jwt_refresh_key: process.env.JWT_REFRESH_KEY,
  jwt_refresh_token_expire: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  jwt_token_expire: process.env.JWT_TOKEN_EXPIRE,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.SOLT_ROUND,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.CALL_BACK_URL,
  origin: process.env.ORIGIN,
};
