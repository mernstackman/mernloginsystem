import crypto from "crypto";

const createHash = (string, salt) => {
  salt = typeof salt !== "undefined" ? salt : createSalt();
  const hash = crypto
    .createHmac("sha256", salt)
    .update(string)
    .digest("hex");

  return hash;
};

const createSalt = () => {
  return Math.round(new Date().valueOf() * Math.random()) + "$";
};

export default { createHash, createSalt };
