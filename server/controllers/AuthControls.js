import { UserModel } from "./../models/UserModel";
import jwt from "jsonwebtoken";
import express_jwt from "express-jwt";
import _ from "lodash";
import { emailRegex, secretKey } from "../../config";
import { confirmMsg } from "./../../email/emailMessages";
import sendEmail from "./../../functions/sendEmail";

/* SIGN IN */
const sign_in = (req, res) => {
  let user = {};
  let enteredID = "";
  if (emailRegex.test(req.body.user)) {
    user = { email: req.body.user };
    enteredID = "email";
  } else {
    user = { username: req.body.user };
    enteredID = "username";
  }

  UserModel.findOne(user)
    // .select("-password_hash -salt")
    .exec((err, output) => {
      if (!output) {
        return res.json({
          Error: "User not found!"
        });
      }

      if (!output.comparePassword(req.body.password)) {
        return res.json({
          Error: `Password and ${enteredID} don't match!`
        });
      }

      // create token
      const token = jwt.sign({ _id: output._id }, secretKey, { algorithm: "HS512" });

      // Store token in HttpOnly cookie and expires in 24 hours - Log in the user
      res.cookie("usin", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 86400000)
      });
      res.json({ token, loggedIn_user: output });
    });
};

/* SIGN OUT */
const sign_out = (req, res) => {
  res.clearCookie("usin");
  return res.status(200).json({ Success: "You are signed out!" });
};

// Require user to sign in to be able to see a page
const signedInOnly = express_jwt({
  secret: secretKey,
  requestProperty: "auth"
});

const currentUserOnly = (req, res, next) => {
  const currentuser = req.auth && req.userinfo && req.auth._id == req.userinfo._id;
  if (!currentuser) {
    return res.status(401).json({
      Forbidden: "You are not allowed to perform such action here!"
    });
  }
  next();
};

const findByParam = (req, res, next, param) => {
  // console.log(param);
  /*   if (param == "send") {
    return;
  } */
  let parameter = {};
  if (emailRegex.test(param)) {
    parameter = { email: param };
  } else {
    parameter = { mailToken: param };
  }

  UserModel.findOne(parameter)
    .select("-password_hash -salt")
    .exec((error, user) => {
      if (error) {
        return res.status(400).json({
          error
        });
      }
      req.userinfo = user;
      next();
    });
};

const checkUserinfo = (req, res, next) => {
  // console.log("req.body");

  next();
};

const mailFromToken = (req, res, next) => {
  // console.log(req.userinfo);
  if (!req.userinfo) {
    return res.json({
      error: "No user found!"
    });
  }
  return res.json({ email: req.userinfo.email });
};

// Request data from model and then pass it through url/ route
const verifyEmail = (req, res, next) => {
  // prevent duplicate request - the only way
  req.connection.setTimeout(1000 * 60 * 10);
  // console.log(process.env.MAIL_USER);
  const user = req.userinfo;
  let a = 0;

  if (!req.userinfo) {
    return res.status(400).json({
      error: "The verification token is not valid. Please register first or recheck your email!"
    });
  }

  console.log(user.confirmed, a++);
  if (user.confirmed == true) {
    return res.status(400).json({
      error: "This user is already verified. Please log in to your account."
    });
  }

  // Check for token expiration (substract date) <---
  const currentDate = new Date();
  const tokenAge = Math.abs(currentDate - user.tokenCreation) / (1000 * 60 * 60);
  if (tokenAge >= 24) {
    return res.status(400).json({
      error: "Token expired!"
    });
  }

  // compare token
  // activate user if valid
  if (user.mailToken === req.body.emailToken) {
    const activation = { confirmed: true, userActivation: currentDate };

    UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: activation },
      { upsert: true, new: true },
      (err, activated) => {
        if (err) {
          return res.status(400).json({
            error: "There are problem when attempting to update this user!"
          });
        }

        return res
          .status(200)
          .json({ activated, success: "Verification succeed! Please log in to your account." });
      }
    ).select("-password_hash -salt");
  }
};

const updateEmailToken = (req, res) => {
  // prevent duplicate request - the only way
  req.connection.setTimeout(1000 * 60 * 10);
  // return console.log(req.userinfo);

  if (req.userinfo.confirmed) {
    return res.status(400).json({ verified: "You don't need to verify your email twice!" });
  }
  const { email, mailToken, mailSalt, tokenCreation } = req.body;

  UserModel.findOneAndUpdate(
    { email },
    { $set: { mailToken, mailSalt, tokenCreation } },
    { upsert: true, new: true }
  )
    .select("-password_hash -salt -mailToken -mailSalt -tokenCreation")
    .exec((error, user) => {
      if (error) {
        return res.status(400).json({
          error: "There are problem when attempting to update your email token!"
        });
      }
      return res.status(200).json({
        user,
        success:
          "Token updated! Please check your email's inbox or spam folder" +
          " for the new verification link!"
      });
    });
};

const sendTheEmail = (req, res) => {
  // prevent duplicate request - the only way
  req.connection.setTimeout(1000 * 60 * 10);

  const emaildata = {
    from: `"MERN Stack Email" ${process.env.MAIL_USER}`,
    to: /* req.body.email */ "mernstackweb@gmail.com",
    ...confirmMsg(req.body.mailToken)
  };
  console.log(emaildata);
  sendEmail(emaildata).then(response => {
    return res.json({ response });
  });
};

export default {
  sign_in,
  sign_out,
  signedInOnly,
  currentUserOnly,
  findByParam,
  verifyEmail,
  mailFromToken,
  updateEmailToken,
  sendTheEmail,
  checkUserinfo
};
