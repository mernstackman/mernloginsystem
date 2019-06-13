const env = process.env.NODE_ENV || "development";

const secretKey =
  process.env.JWT_SECRET || "099093b9390d697a5935d212b889b8bf580dd7e8efa58dec59140a740f2da6b7";
const PORT = process.env.PORT || 3000;
const mongoClientURI =
  process.env.MONGODB_URI ||
  process.env.MONGO_HOST ||
  "mongodb://" +
    (process.env.IP || "localhost") +
    ":" +
    (process.env.MONGO_PORT || "27017") +
    "/mernloginsystem";
const CLIENT_ORIGIN = env === "production" ? env : "http//:localhost/3000";
const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const mailRegex = /.+\@.+\..+/;
const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
const userRegex = /[$&+,:;=\\\\?@#|/\'\"\`\~<>.^*()%!-\s]/;

module.exports = {
  secretKey,
  PORT,
  mongoClientURI,
  CLIENT_ORIGIN,
  emailRegex,
  passRegex,
  userRegex
};
