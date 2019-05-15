/* Called in express.js */
import express from "express";
import UserControl from "../controllers/UserControls";
import authControl from "../controllers/AuthControls";

const user_router = express.Router();

// General users
user_router
  .route("/api/users")
  .post(UserControl.create) // create new user
  .get(UserControl.list); // list users
//.delete(UserControl.clean_all); // delete all documents in collection {experimental}

user_router.route("/api/checks").post(UserControl.check_unique); // create new user
// Specific user by id
user_router
  .route("/api/users/:user_id")
  .get(authControl.signedInOnly, UserControl.get_one)
  .put(authControl.signedInOnly, authControl.currentUserOnly, UserControl.update_one)
  .delete(authControl.signedInOnly, authControl.currentUserOnly, UserControl.delete_one)
  .post(authControl.signedInOnly, authControl.currentUserOnly, UserControl.move_and_delete);

// Backup user before deletion
// user_router.route("/api/users/backup");

user_router.param("user_id", UserControl.user_id);

export default user_router;
