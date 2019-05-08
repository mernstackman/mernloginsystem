import express from "express";
import authCtrl from "../controllers/AuthControls";

const router = express.Router();

router.route("/api/signin").post(authCtrl.sign_in);
router.route("/api/signout").get(authCtrl.sign_out);

export default router;
