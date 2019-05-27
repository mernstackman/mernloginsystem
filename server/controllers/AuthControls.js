import { UserModel, UserModel_deleted } from "./../models/UserModel";
import jwt from "jsonwebtoken";
import express_jwt from "express-jwt";
import config from "./../../config";

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

const verifyEmail = () => {};

export default { sign_in, sign_out, signedInOnly, currentUserOnly, verifyEmail };
