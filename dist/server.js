/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = {\n  env: \"development\" || false,\n  secretKey: process.env.JWT_SECRET || \"099093b9390d697a5935d212b889b8bf580dd7e8efa58dec59140a740f2da6b7\"\n};\n\n//# sourceURL=webpack:///./config.js?");

/***/ }),

/***/ "./server/controllers/AuthControls.js":
/*!********************************************!*\
  !*** ./server/controllers/AuthControls.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _UserModel = __webpack_require__(/*! ./../models/UserModel */ \"./server/models/UserModel.js\");\n\nvar _jsonwebtoken = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nvar _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);\n\nvar _expressJwt = __webpack_require__(/*! express-jwt */ \"express-jwt\");\n\nvar _expressJwt2 = _interopRequireDefault(_expressJwt);\n\nvar _config = __webpack_require__(/*! ./../../config */ \"./config.js\");\n\nvar _config2 = _interopRequireDefault(_config);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/* SIGN IN */\nvar sign_in = function sign_in(req, res) {\n  var regex = /.+\\@.+\\..+/;\n  var user = {};\n  var enteredID = \"\";\n\n  if (regex.test(req.body.user)) {\n    user = { email: req.body.user };\n    enteredID = \"email\";\n  } else {\n    user = { username: req.body.user };\n    enteredID = \"username\";\n  }\n\n  _UserModel.UserModel.findOne(user).exec(function (err, result) {\n    if (!result) {\n      return res.json({\n        Error: \"User not found!\"\n      });\n    }\n\n    if (!result.comparePassword(req.body.password)) {\n      return res.json({\n        Error: \"Password and \" + enteredID + \" don't match!\"\n      });\n    }\n\n    // create token\n    var token = _jsonwebtoken2.default.sign({ _id: result._id }, _config2.default.secretKey, { algorithm: \"HS512\"\n      // ,(err, token) => {}\n    });\n\n    // Store token in HttpOnly cookie and expires in 24 hours - Log in the user\n    res.cookie(\"usin\", token, {\n      httpOnly: true,\n      expires: new Date(Date.now() + 86400000)\n    });\n\n    var output = {\n      _id: result._id,\n      username: result.username,\n      fullname: result.fullname,\n      email: result.email,\n      created: result.created,\n      updated: result.updated,\n      updateCount: result.updateCount\n    };\n    /*     console.log(result);\r\n    output[\"created\"] = null;\r\n    output[\"salt\"] = null;\r\n    output[\"password_hash\"] = null; */\n    res.json({ token: token, loggedIn_user: output });\n  });\n};\n\n/* SIGN OUT */\nvar sign_out = function sign_out(req, res) {\n  res.clearCookie(\"usin\");\n  return res.status(200).json({ Success: \"You are signed out!\" });\n};\n\n// Require user to sign in to be able to see a page\nvar signedInOnly = (0, _expressJwt2.default)({\n  secret: _config2.default.secretKey,\n  requestProperty: \"auth\"\n});\n\nvar currentUserOnly = function currentUserOnly(req, res, next) {\n  var currentuser = req.auth && req.userinfo && req.auth._id == req.userinfo._id;\n  if (!currentuser) {\n    return res.status(401).json({\n      Forbidden: \"You are not allowed to perform such action here!\"\n    });\n  }\n  next();\n};\n\nexports.default = { sign_in: sign_in, sign_out: sign_out, signedInOnly: signedInOnly, currentUserOnly: currentUserOnly };\n\n//# sourceURL=webpack:///./server/controllers/AuthControls.js?");

/***/ }),

/***/ "./server/controllers/UserControls.js":
/*!********************************************!*\
  !*** ./server/controllers/UserControls.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _UserModel = __webpack_require__(/*! ./../models/UserModel */ \"./server/models/UserModel.js\");\n\nvar _lodash = __webpack_require__(/*! lodash */ \"lodash\");\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /*\r\n                                                                                                                                                                                                                              * Data manipulator/ Model controller for user data/ model\r\n                                                                                                                                                                                                                              * This file contain a collection of CRUD functions that is called inside the UserRoutes.js\r\n                                                                                                                                                                                                                              */\n\n// CREATE USER\nvar create = function create(req, res, next) {\n  var user = new _UserModel.UserModel(req.body);\n\n  // Required validation\n  user.save(function (err, result) {\n    if (err) {\n      return res.status(400).json({\n        error: err\n      });\n    }\n    return res.status(200).json({\n      message: \"Saved to database!\"\n    });\n  });\n};\n\n// LIST USER\nvar list = function list(req, res) {\n  _UserModel.UserModel.find({}, function (err, users) {\n    if (err) {\n      return res.status(400).json({\n        error: \"Error occured!\"\n      });\n    }\n\n    return res.status(200).json(users);\n  }).select(\"fullname email username created\");\n};\n\n// CLEAN ALL USERS\nvar clean_all = function clean_all(req, res) {\n  return _UserModel.UserModel.deleteMany({}, function (err, users) {});\n};\n\n// GET SELECTED USER'S DATA TO BE USED ON THE NEXT MIDDLEWARE\nvar user_id = function user_id(req, res, next, id) {\n  _UserModel.UserModel.findById(id).exec(function (err, user) {\n    if (err) {\n      return res.status(400).json({\n        error: \"Cannot retrieve user with that id!\"\n      });\n    }\n\n    req.userinfo = user;\n\n    next();\n  });\n};\n\n// MOVE AND DELETE\nvar move_and_delete = function move_and_delete(req, res, next) {\n  if (req.userinfo === null) {\n    return res.status(400).json({\n      error: \"That user does not exist!\"\n    });\n  }\n\n  if (!req.userinfo.comparePassword(req.body.password)) {\n    return res.status(400).json({\n      error: \"Password not match!\"\n    });\n  }\n\n  var _req$userinfo$toObjec = req.userinfo.toObject(),\n      _id = _req$userinfo$toObjec._id,\n      user_data = _objectWithoutProperties(_req$userinfo$toObjec, [\"_id\"]);\n\n  var moved = new _UserModel.UserModel_deleted(user_data);\n  moved.save(function (err, result) {\n    if (err) {\n      if (err.errmsg.includes(\"duplicate\")) {\n        return delete_one(req, res, \"Cannot save duplicate data!\");\n      }\n      console.log(err);\n      return res.status(400).json({\n        error: err\n      });\n    }\n    delete_one(req, res, \"Saved to database!\");\n  });\n};\n// END move and delete\n\n// DELETE ONE USER\nvar delete_one = function delete_one(req, res, message) {\n  var selected_user = req.userinfo;\n  console.log(\"delete_one\");\n  if (selected_user === null) {\n    return res.status(400).json({\n      error: \"That user does not exist!\"\n    });\n  }\n  _UserModel.UserModel.deleteOne({ _id: selected_user._id }, function (err, user) {\n    if (err) {\n      console.log(err);\n      return res.status(400).json({\n        error: \"Something went wrong!\"\n      });\n    }\n    // console.log({ message, user });\n    return res.status(200).json({ success: { message: message, user: user } });\n  });\n};\n\n// UPDATE ONE USER\nvar update_one = function update_one(req, res) {\n  console.log(\"update_one\");\n\n  if (!/.+\\@.+\\..+/.test(req.body.email) || req.body.email === req.userinfo.email) {\n    return res.status(400).json({\n      error: \"Email pattern should be valid and can't be the same as the already registered one!\"\n    });\n  }\n\n  var selected_user = req.userinfo; // From const user_id above\n  selected_user = _lodash2.default.extend(selected_user, req.body);\n\n  _UserModel.UserModel.updateOne({ _id: selected_user.id }, selected_user, function (err, updated) {\n    if (err) {\n      return res.status(400).json({\n        error: \"There are problem when attempting to update this user!\"\n      });\n    }\n\n    return res.json(updated);\n  });\n};\n\n// GET ONE USER\nvar get_one = function get_one(req, res, next) {\n  if (!req.userinfo) {\n    return res.status(400).json({\n      message: \"Forbiddem!\"\n    });\n  }\n  console.log(\"get_one\");\n  return res.json(req.userinfo);\n  // next();\n};\n\n// Check username and email availability\nvar check_unique = function check_unique(req, res) {\n  var field = {};\n  var fieldLabel = \"\";\n\n  if (req.body.email) {\n    field = { email: req.body.email };\n    fieldLabel = \"email\";\n  }\n\n  if (req.body.username) {\n    field = { username: req.body.username };\n    fieldLabel = \"username\";\n  }\n\n  _UserModel.UserModel.findOne(field).select(\"username email\").lean().then(function (result) {\n    if (result) {\n      return res.json({\n        message: fieldLabel + \" already used!\",\n        inUse: true\n      });\n    }\n\n    return res.json({\n      message: \"\",\n      inUse: false\n    });\n  });\n};\n\nexports.default = {\n  create: create,\n  list: list,\n  clean_all: clean_all,\n  user_id: user_id,\n  move_and_delete: move_and_delete,\n  delete_one: delete_one,\n  update_one: update_one,\n  get_one: get_one,\n  check_unique: check_unique\n};\n\n//# sourceURL=webpack:///./server/controllers/UserControls.js?");

/***/ }),

/***/ "./server/express.js":
/*!***************************!*\
  !*** ./server/express.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _express = __webpack_require__(/*! express */ \"express\");\n\nvar _express2 = _interopRequireDefault(_express);\n\nvar _bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nvar _bodyParser2 = _interopRequireDefault(_bodyParser);\n\nvar _path = __webpack_require__(/*! path */ \"path\");\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _cors = __webpack_require__(/*! cors */ \"cors\");\n\nvar _cors2 = _interopRequireDefault(_cors);\n\nvar _UserRoutes = __webpack_require__(/*! ./routes/UserRoutes */ \"./server/routes/UserRoutes.js\");\n\nvar _UserRoutes2 = _interopRequireDefault(_UserRoutes);\n\nvar _AuthRoutes = __webpack_require__(/*! ./routes/AuthRoutes */ \"./server/routes/AuthRoutes.js\");\n\nvar _AuthRoutes2 = _interopRequireDefault(_AuthRoutes);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar app = (0, _express2.default)();\n\napp.use(_bodyParser2.default.json());\napp.use(_bodyParser2.default.urlencoded({ extended: true }));\napp.use(\"*\", (0, _cors2.default)());\n\napp.use(\"/\", _UserRoutes2.default);\napp.use(\"/\", _AuthRoutes2.default);\n\n// Let the things inside frontend folder loadable from browser under public path\napp.use(\"/public\", _express2.default.static(_path2.default.join(__dirname, \"frontend\")));\n\n// No matter what browser ask, return the content\napp.get(\"*\", function (req, res) {\n  res.status(200).sendFile(_path2.default.join(__dirname, \"./index.html\"));\n});\n\nexports.default = app;\n\n//# sourceURL=webpack:///./server/express.js?");

/***/ }),

/***/ "./server/models/UserModel.js":
/*!************************************!*\
  !*** ./server/models/UserModel.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.UserModel_deleted = exports.UserModel = undefined;\n\nvar _mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nvar _mongoose2 = _interopRequireDefault(_mongoose);\n\nvar _crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nvar _crypto2 = _interopRequireDefault(_crypto);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// import dateFormat from \"dateformat\";\n\n/* Called in UserControl.js */\n_mongoose2.default.set(\"useCreateIndex\", true);\n\nvar Schema = _mongoose2.default.Schema;\n\nvar UserSchema = new Schema({\n  fullname: {\n    type: String,\n    trim: true\n    // required: true\n  },\n  username: {\n    type: String,\n    trim: true,\n    unique: true,\n    required: true\n  },\n  email: {\n    type: String,\n    trim: true,\n    unique: true,\n    match: [/.+\\@.+\\..+/, \"Please enter valid email!\"],\n    required: true\n  },\n  password_hash: {\n    type: String,\n    unique: true,\n    required: true\n  },\n  salt: String,\n  created: {\n    type: Date,\n    default: new Date()\n  },\n  updated: Date,\n  updateCount: { type: Number, default: 0 }\n});\n\n// Create virtual data of UserSchema for input field with the named password and obfuscate its value\nUserSchema.virtual(\"password\").set(function (value) {\n  this._password = value;\n  // generate salt for password hashing\n  this.salt = this.createSalt();\n  // Use salt along with the password to create password_hash\n  this.password_hash = this.hashThePassword(value);\n}).get(function () {\n  this._password;\n});\n\nUserSchema.virtual(\"password_confirm\").set(function (value) {\n  this.passwordConfirm = value;\n}).get(function () {\n  this.passwordConfirm;\n});\n\n/* VALIDATION */\n\n/* After creating the virtual type of password\r\n * We can check if user's entered password match the rule using mongoose\r\n * https://gist.github.com/swaj/1350041\r\n */\n\n// -?test-> check what happens if validate is applied to virtual path named password\nUserSchema.path(\"password_hash\").validate(function (value) {\n  if (this._password || this.passwordConfirm) {\n    var passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;\n    if (passRegex.test(this._password)) {\n      this.invalidate(\"password\", \"Password don't match the requirements!\");\n    }\n\n    if (this._password !== this.passwordConfirm) {\n      this.invalidate(\"password\", \"Passwords don't match!\");\n    }\n  }\n\n  if (this.isNew && !this._password && !this.password_hash) {\n    this.invalidate(\"password\", \"Password is required!\");\n  }\n});\n\n// Validate fullname\nUserSchema.path(\"fullname\").validate(function (value) {\n  if (value.length > 100 || value.length < 1) {\n    this.invalidate(\"fullname\", \"Name should be between 1 to 100 characters long!\");\n  }\n});\n\n/* ADDITIONAL METHODS */\nUserSchema.methods = {\n  comparePassword: function comparePassword(loginPassword) {\n    if (!this.password_hash) return null;\n    return this.hashThePassword(loginPassword) === this.password_hash;\n  },\n  hashThePassword: function hashThePassword(password) {\n    // Use bcrypt for better login authentication\n    var hash = _crypto2.default.createHmac(\"sha256\", this.salt).update(password).digest(\"hex\");\n\n    return hash;\n  },\n  createSalt: function createSalt() {\n    return Math.round(new Date().valueOf() * Math.random()) + \"$\";\n  }\n};\n\nvar UserModel = _mongoose2.default.model(\"UserModel\", UserSchema);\nvar UserModel_deleted = _mongoose2.default.model(\"UserModel_deleted\", UserSchema);\nexports.UserModel = UserModel;\nexports.UserModel_deleted = UserModel_deleted;\n\n//# sourceURL=webpack:///./server/models/UserModel.js?");

/***/ }),

/***/ "./server/routes/AuthRoutes.js":
/*!*************************************!*\
  !*** ./server/routes/AuthRoutes.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _express = __webpack_require__(/*! express */ \"express\");\n\nvar _express2 = _interopRequireDefault(_express);\n\nvar _AuthControls = __webpack_require__(/*! ../controllers/AuthControls */ \"./server/controllers/AuthControls.js\");\n\nvar _AuthControls2 = _interopRequireDefault(_AuthControls);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar router = _express2.default.Router();\n\nrouter.route(\"/api/signin\").post(_AuthControls2.default.sign_in);\nrouter.route(\"/api/signout\").get(_AuthControls2.default.sign_out);\n\nexports.default = router;\n\n//# sourceURL=webpack:///./server/routes/AuthRoutes.js?");

/***/ }),

/***/ "./server/routes/UserRoutes.js":
/*!*************************************!*\
  !*** ./server/routes/UserRoutes.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _express = __webpack_require__(/*! express */ \"express\");\n\nvar _express2 = _interopRequireDefault(_express);\n\nvar _UserControls = __webpack_require__(/*! ../controllers/UserControls */ \"./server/controllers/UserControls.js\");\n\nvar _UserControls2 = _interopRequireDefault(_UserControls);\n\nvar _AuthControls = __webpack_require__(/*! ../controllers/AuthControls */ \"./server/controllers/AuthControls.js\");\n\nvar _AuthControls2 = _interopRequireDefault(_AuthControls);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar user_router = _express2.default.Router();\n\n// General users\n/* Called in express.js */\nuser_router.route(\"/api/users\").post(_UserControls2.default.create) // create new user\n.get(_UserControls2.default.list); // list users\n//.delete(UserControl.clean_all); // delete all documents in collection {experimental}\n\nuser_router.route(\"/api/checks\").post(_UserControls2.default.check_unique); // create new user\n// Specific user by id\nuser_router.route(\"/api/users/:user_id\").get(_AuthControls2.default.signedInOnly, _UserControls2.default.get_one).put(_AuthControls2.default.signedInOnly, _AuthControls2.default.currentUserOnly, _UserControls2.default.update_one).delete(_AuthControls2.default.signedInOnly, _AuthControls2.default.currentUserOnly, _UserControls2.default.delete_one).post(_AuthControls2.default.signedInOnly, _AuthControls2.default.currentUserOnly, _UserControls2.default.move_and_delete);\n\n// Backup user before deletion\n// user_router.route(\"/api/users/backup\");\n\nuser_router.param(\"user_id\", _UserControls2.default.user_id);\n\nexports.default = user_router;\n\n//# sourceURL=webpack:///./server/routes/UserRoutes.js?");

/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _express = __webpack_require__(/*! ./express */ \"./server/express.js\");\n\nvar _express2 = _interopRequireDefault(_express);\n\nvar _mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nvar _mongoose2 = _interopRequireDefault(_mongoose);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar PORT = process.env.PORT || 3000;\nvar mongoClientURI = process.env.MONGODB_URI || process.env.MONGO_HOST || \"mongodb://\" + (process.env.IP || \"localhost\") + \":\" + (process.env.MONGO_PORT || \"27017\") + \"/mernloginsystem\";\n\n/* CONNECT TO MONGODB */\nvar db = _mongoose2.default.connect;\ndb(mongoClientURI);\n_mongoose2.default.connection.on(\"error\", function () {\n  throw new Error(\"Unable to connect to \" + mongoClientURI);\n}).once(\"open\", function () {\n  console.log(\"Connected to %s\", mongoClientURI);\n});\n/* <-- end --> */\n\n/* CONNECT To NodeJs SERVER USING EXPRESS */\n_express2.default.listen(3000, function (err) {\n  if (err) {\n    console.log(err);\n  }\n  console.log(\"Server running on port \" + PORT);\n});\n/* <--end--> */\n\n//# sourceURL=webpack:///./server/server.js?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-jwt\");\n\n//# sourceURL=webpack:///external_%22express-jwt%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });