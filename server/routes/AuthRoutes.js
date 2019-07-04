import express from "express";
import authCtrl from "../controllers/AuthControls";

const router = express.Router();

router.route("/api/signin").post(authCtrl.sign_in);
router.route("/api/signout").get(authCtrl.sign_out);
router.route("/email/verify/:findbyparam").get(authCtrl.mailFromToken);
router.route("/value/check/:findbyparam").get(authCtrl.checkUserinfo);
router.route("/password/update").put(authCtrl.updateByEmail);
//   .post(authCtrl.verifyEmail);
router
  .route("/email/:findbyparam")
  .post(authCtrl.verifyEmail)
  .put(authCtrl.updateEmailToken);

router.route("/send/email").post(authCtrl.sendTheEmail);

router.param("findbyparam", authCtrl.findByParam);

export default router;
