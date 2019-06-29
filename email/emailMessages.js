import { CLIENT_ORIGIN } from "../config";

const confirmMsg = token => ({
  subject: "Confirm Your Email",
  text: `Copy and paste this url in your browser ${CLIENT_ORIGIN}/email/${token}`,
  html: `Click the following link to confirm your email<br>
    <b><a href="${CLIENT_ORIGIN}/email/${token}">CONFIRM</a></b>`
});

const resetPwMsg = token => ({
  subject: "Password Reset",
  text: `Copy and paste this url in your browser ${CLIENT_ORIGIN}/password/recovery/${token}`,
  html: `Click the following link to reset your password<br>
    <b><a href="${CLIENT_ORIGIN}/password/recovery/${token}">RESET PASSWORD</a></b>`
});
module.exports = { confirmMsg, resetPwMsg };
