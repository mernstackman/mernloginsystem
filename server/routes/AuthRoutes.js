import express from "express";
import authCtrl from "../controllers/AuthControls";

const router = express.Router();

router.route("/api/signin").post(authCtrl.sign_in);
router.route("/api/signout").get(authCtrl.sign_out);
router.route("/email/verify/:emailtoken").post(authCtrl.verifyEmail);
router.route("/email/verify").post(authCtrl.verifyEmail);

router.param("emailtoken", authCtrl.emailtoken);

export default router;
