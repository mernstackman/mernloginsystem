import env from "./env";

const envr = env.NODE_ENV || "development";

const secretKey =
  env.JWT_SECRET || "099093b9390d697a5935d212b889b8bf580dd7e8efa58dec59140a740f2da6b7";
const PORT = env.PORT || 3000;
const mongoClientURI =
  env.MONGODB_URI ||
  env.MONGO_HOST ||
  "mongodb://" + (env.IP || "localhost") + ":" + (env.MONGO_PORT || "27017") + "/mernloginsystem";
const CLIENT_ORIGIN = envr === "production" ? envr : "http://localhost:3000";
const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const mailRegex = /.+\@.+\..+/;
const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
const userRegex = /[$&+,:;=\\\\?@#|/\'\"\`\~<>.^*()%!-\s]/;
const user = env.MAIL_USER || "mernstackemail@gmail.com";
const pass = env.MAIL_PASS || "%3A%2F%2Fma";
const mailUser = env.MAIL_USER;

module.exports = {
  secretKey,
  PORT,
  mongoClientURI,
  CLIENT_ORIGIN,
  emailRegex,
  passRegex,
  userRegex,
  user,
  pass,
  mailUser
};
