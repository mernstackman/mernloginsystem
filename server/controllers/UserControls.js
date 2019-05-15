/*
 * Data manipulator/ Model controller for user data/ model
 * This file contain a collection of CRUD functions that is called inside the UserRoutes.js
 */

import { UserModel, UserModel_deleted } from "./../models/UserModel";
import _ from "lodash";

// CREATE USER
const create = (req, res, next) => {
  const user = new UserModel(req.body);

  // Required validation
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    return res.status(200).json({
      message: "Saved to database!"
    });
  });
};

// LIST USER
const list = (req, res) => {
  UserModel.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured!"
      });
    }

    return res.status(200).json(users);
  }).select("fullname email username created");
};

// CLEAN ALL USERS
const clean_all = (req, res) => {
  return UserModel.deleteMany({}, (err, users) => {});
};

// GET SELECTED USER'S DATA TO BE USED ON THE NEXT MIDDLEWARE
const user_id = (req, res, next, id) => {
  UserModel.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot retrieve user with that id!"
      });
    }

    req.userinfo = user;

    next();
  });
};

// MOVE AND DELETE
const move_and_delete = (req, res, next) => {
  if (req.userinfo === null) {
    return res.status(400).json({
      error: "That user does not exist!"
    });
  }

  if (!req.userinfo.comparePassword(req.body.password)) {
    return res.status(400).json({
      error: "Password not match!"
    });
  }
  const { _id, ...user_data } = req.userinfo.toObject();
  const moved = new UserModel_deleted(user_data);
  moved.save((err, result) => {
    if (err) {
      if (err.errmsg.includes("duplicate")) {
        return delete_one(req, res, "Cannot save duplicate data!");
      }
      console.log(err);
      return res.status(400).json({
        error: err
      });
    }
    delete_one(req, res, "Saved to database!");
  });
};
// END move and delete

// DELETE ONE USER
const delete_one = (req, res, message) => {
  let selected_user = req.userinfo;
  console.log("delete_one");
  if (selected_user === null) {
    return res.status(400).json({
      error: "That user does not exist!"
    });
  }
  UserModel.deleteOne({ _id: selected_user._id }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong!"
      });
    }
    // console.log({ message, user });
    return res.status(200).json({ success: { message, user } });
  });
};

// UPDATE ONE USER
const update_one = (req, res) => {
  console.log("update_one");

  if (!/.+\@.+\..+/.test(req.body.email) || req.body.email === req.userinfo.email) {
    return res.status(400).json({
      error: "Email pattern should be valid and can't be the same as the already registered one!"
    });
  }

  let selected_user = req.userinfo; // From const user_id above
  selected_user = _.extend(selected_user, req.body);

  UserModel.updateOne({ _id: selected_user.id }, selected_user, (err, updated) => {
    if (err) {
      return res.status(400).json({
        error: "There are problem when attempting to update this user!"
      });
    }

    return res.json(updated);
  });
};

// GET ONE USER
const get_one = (req, res, next) => {
  if (!req.userinfo) {
    return res.status(400).json({
      message: "Forbiddem!"
    });
  }
  console.log("get_one");
  return res.json(req.userinfo);
  // next();
};

// Check username and email availability
const check_unique = (req, res) => {
  const regex = /.+\@.+\..+/;
  let field = {};
  let fieldLabel = "";

  if (req.body.email) {
    field = { email: req.body.email };
    fieldLabel = "email";
  }

  if (req.body.username) {
    field = { username: req.body.username };
    fieldLabel = "username";
  }

  UserModel.findOne(field)
    .select("username email")
    .lean()
    .then(result => {
      if (result) {
        return res.json({
          message: `${fieldLabel} already used!`,
          inUse: true
        });
      }

      return res.json({
        message: "Available",
        inUse: false
      });
    });
};

export default {
  create,
  list,
  clean_all,
  user_id,
  move_and_delete,
  delete_one,
  update_one,
  get_one,
  check_unique
};
