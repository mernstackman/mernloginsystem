/* Called in UserControl.js */
import mongoose from "mongoose";
import crypto from "crypto";
// import dateFormat from "dateformat";

mongoose.set("useCreateIndex", true);

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
    match: [/.+\@.+\..+/, "Please enter valid email!"],
    required: true
  },
  password_hash: {
    type: String,
    unique: true,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: new Date()
  },
  updated: Date,
  updateCount: { type: Number, default: 0 }
});

// Create virtual data of UserSchema for input field with the named password and obfuscate its value
UserSchema.virtual("password")
  .set(function(value) {
    this._password = value;
    // generate salt for password hashing
    this.salt = this.createSalt();
    // Use salt along with the password to create password_hash
    this.password_hash = this.hashThePassword(value);
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
    const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
    if (passRegex.test(this._password)) {
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
  const userRegex = /[$&+,:;=\\\\?@#|/\'\"\`\~<>.^*()%!-\s]/;
  if (userRegex.test(value)) {
    this.invalidate("username", "Username cannot contain space or restricted special characters!");
  }
});

/* ADDITIONAL METHODS */
UserSchema.methods = {
  comparePassword: function(loginPassword) {
    if (!this.password_hash) return null;
    return this.hashThePassword(loginPassword) === this.password_hash;
  },
  hashThePassword: function(password) {
    // Use bcrypt for better login authentication
    const hash = crypto
      .createHmac("sha256", this.salt)
      .update(password)
      .digest("hex");

    return hash;
  },
  createSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + "$";
  }
};

const UserModel = mongoose.model("UserModel", UserSchema);
const UserModel_deleted = mongoose.model("UserModel_deleted", UserSchema);
export { UserModel, UserModel_deleted };
