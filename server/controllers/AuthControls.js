import { UserModel, UserModel_deleted } from "./../models/UserModel";
import jwt from "jsonwebtoken";
import express_jwt from "express-jwt";
import config from "./../../config";
import _ from "lodash";

/* SIGN IN */
const sign_in = (req, res) => {
  const regex = /.+\@.+\..+/;
  let user = {};
  let enteredID = "";
  if (regex.test(req.body.user)) {
    user = { email: req.body.user };
    enteredID = "email";
  } else {
    user = { username: req.body.user };
    enteredID = "username";
  }

  UserModel.findOne(user).exec((err, result) => {
    if (!result) {
      return res.json({
        Error: "User not found!"
      });
    }

    if (!result.comparePassword(req.body.password)) {
      return res.json({
        Error: `Password and ${enteredID} don't match!`
      });
    }

    // create token
    const token = jwt.sign(
      { _id: result._id },
      config.secretKey,
      { algorithm: "HS512" }
      // ,(err, token) => {}
    );

    // Store token in HttpOnly cookie and expires in 24 hours - Log in the user
    res.cookie("usin", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 86400000)
    });

    const output = {
      _id: result._id,
      username: result.username,
      fullname: result.fullname,
      email: result.email,
      created: result.created,
      updated: result.updated,
      updateCount: result.updateCount
    };
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
  secret: config.secretKey,
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

const emailtoken = (req, res, next, token) => {
  // console.log(token);
  UserModel.findOne({ mailToken: token }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        Error: "Email token is expired!"
      });
    }
    req.userinfo = user;
    next();
  });
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

const testMailToken = (req, res) => {};

// Request data from model and then pass it through url/ route
const verifyEmail = (req, res, next) => {
  // console.log(req.userinfo);
  // check if token present in the url
  if (!req.userinfo) {
    return res.status(400).json({
      error: "The verification token is not valid. Please register first!",
      norecord: true
    });
  }

  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return res.status(400).json({
      error: "Not enough data is supplied!"
    });
  }

  const user = req.userinfo;

  /*     if (user.confirmed) {
    return res.status(400).json({
      error: "This user is verified."
    });
  }

  // Check for token expiration (substract date) <---
  const currentDate = new Date();
  const tokenAge = (Math.abs(currentDate - user.tokenCreation) / (1000 * 60 * 60)) % 24;
  if (tokenAge >= 24) {
    return res.status(400).json({
      error: "Token expired!"
    });
  } */

  // Check for token expiration (substract date) <---
  const currentDate = new Date();
  const tokenAge = Math.abs(currentDate - user.tokenCreation) / (1000 * 60 * 60);
  console.log(tokenAge);
  if (tokenAge >= 20) {
    return res.status(400).json({
      error: "Token expired!"
    });
  }
  /* 
  console.log(user.tokenCreation.getTime());
  console.log(
    Math.abs(currentDate.getTime() - new Date(user.tokenCreation.toString()).getTime()),
    1
  );
  console.log(Math.abs(currentDate.getTime() - user.tokenCreation.getTime()), 2);
  console.log(Math.abs(currentDate - user.tokenCreation), 3);
  console.log(tokenAge >= 0.5); */

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

        return res.status(200).json({ activated, success: "Verification succeed!" });
      }
    );
  }
};

const updateEmailToken = () => {};

const expireEmailToken = () => {};

const sendEmailToken = () => {};

export default {
  sign_in,
  sign_out,
  signedInOnly,
  currentUserOnly,
  emailtoken,
  verifyEmail,
  mailFromToken,
  updateEmailToken,
  expireEmailToken,
  sendEmailToken
};
