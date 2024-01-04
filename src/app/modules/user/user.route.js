/* eslint-disable node/no-extraneous-require */
const express = require("express");

const validateRequest = require("../../../Middleware/validateRequest");
const JoiUserValidationSchema = require("./user.validation");
const { UploadImageCloudinary } = require("../../../Middleware/upload");
const userController = require("./user.controller");
const router = express.Router();

router.post(
  "/create",
  UploadImageCloudinary.single("user_image"),
  validateRequest(JoiUserValidationSchema.userCreateJoiValidationSchema),
  userController.userRegistration
);
router.post(
  "/login",
  validateRequest(JoiUserValidationSchema.loginSchema),
  userController.userLogin
);
// router.get("/logged-in-user", authVerification, userController.loggedInUser);

// router.post(
//   "/refresh-token",
//   validateRequest(JoiValidationSchema.refreshTokenJoiSchema),
//   userController.refreshToken
// );
router.post("/logout", userController.logout);

const userRouter = router;

module.exports = userRouter;
