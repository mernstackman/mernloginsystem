/* Called in UserControl.js */
import mongoose from "mongoose";
// import crypto from "crypto";
import hasher from "./../../functions/hasher";
// import dateFormat from "dateformat";
import { emailRegex, passRegex, userRegex } from "../../config";

// Moved to server.js
// mongoose.set("useCreateIndex", true);

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: {
    type: String,
    trim: true
    // required: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: [emailRegex, "Please enter valid email!"],
    required: true
  },
  password_hash: {
    type: String,
    unique: true,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: new Date()
  },
  pwResetToken: String,
  salt: String,
  mailSalt: String,
  updated: Date,
  updateCount: { type: Number, default: 0 },
  mailToken: { type: String, default: "" },
  tokenCreation: Date,
  userActivation: Date
});

// Create virtual data of UserSchema for input field with the named password and obfuscate its value
UserSchema.virtual("password")
  .set(function(value) {
    this._password = value;
    // generate salt for password hashing
    this.salt = hasher.createSalt();
    // Use salt along with the password to create password_hash
    this.password_hash = hasher.createHash(value, this.salt);
  })
  .get(function() {
    this._password;
  });

UserSchema.virtual("password_confirm")
  .set(function(value) {
    this.passwordConfirm = value;
  })
  .get(function() {
    this.passwordConfirm;
  });

/* VALIDATION */

/* After creating the virtual type of password
 * We can check if user's entered password match the rule using mongoose
 * https://gist.github.com/swaj/1350041
 */

// -?test-> check what happens if validate is applied to virtual path named password
UserSchema.path("password_hash").validate(function(value) {
  if (this._password || this.passwordConfirm) {
    if (!passRegex.test(this._password)) {
      console.log(this._password);
      this.invalidate("password", "Password don't match the requirements!");
    }

    if (this._password !== this.passwordConfirm) {
      this.invalidate("password", "Passwords don't match!");
    }
  }

  if (this.isNew && !this._password && !this.password_hash) {
    this.invalidate("password", "Password is required!");
  }
});

// Validate fullname
UserSchema.path("fullname").validate(function(value) {
  if (value.length > 100 || value.length < 1) {
    this.invalidate("fullname", "Name should be between 1 to 100 characters long!");
  }
});

// Validate username
UserSchema.path("username").validate(function(value) {
  if (userRegex.test(value)) {
    this.invalidate("username", "Username cannot contain space or restricted special characters!");
  }
});

/* ADDITIONAL METHODS */
UserSchema.methods = {
  comparePassword: function(loginPassword) {
    if (!this.password_hash) return null;
    console.log(hasher.createHash(loginPassword, this.salt));
    return hasher.createHash(loginPassword, this.salt) === this.password_hash;
  }
};

const UserModel = mongoose.model("UserModel", UserSchema);
const UserModel_deleted = mongoose.model("UserModel_deleted", UserSchema);
export { UserModel, UserModel_deleted };
