import express from "express";
import authCtrl from "../controllers/AuthControls";
import UserControl from "../controllers/UserControls";

const router = express.Router();

router.route("/api/signin").post(authCtrl.sign_in);
router.route("/api/signout").get(authCtrl.sign_out);
router.route("/email/verify/:emailtoken").get(authCtrl.mailFromToken);
//   .post(authCtrl.verifyEmail);
router.route("/email/:emailtoken").post(authCtrl.checkUserinfo, authCtrl.verifyEmail);
router.route("/email/:user_id").put(authCtrl.updateEmailToken);

router.param("emailtoken", authCtrl.emailtoken).param("user_id", UserControl.user_id);

export default router;
