import crypto from "crypto";

const createHash = string => {
  const hash = crypto
    .createHmac("sha256", createSalt())
    .update(string)
    .digest("hex");

  return hash;
};

const createSalt = () => {
  return Math.round(new Date().valueOf() * Math.random()) + "$";
};

export default { createHash };
