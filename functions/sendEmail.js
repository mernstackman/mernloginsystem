import nodemailer from "nodemailer";
import { user, pass } from "../config";

const credentials = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user, // generated ethereal user
    pass // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  }
};

const transporter = nodemailer.createTransport(credentials);

const sendEmail = emaildata => {
  console.log(credentials);
  return new Promise((resolve, reject) => {
    transporter.sendMail(emaildata, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  }).catch(err => console.log(err));
};

export default sendEmail;
