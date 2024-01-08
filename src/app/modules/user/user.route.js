/* eslint-disable node/no-extraneous-require */
const express = require("express");

const validateRequest = require("../../../Middleware/validateRequest");
const JoiUserValidationSchema = require("./user.validation");
const { UploadImageCloudinary } = require("../../../Middleware/upload");
const userController = require("./user.controller");
const authVerification = require("../../../Middleware/authVarification");
const { authorizeRoles } = require("../../../Middleware/roleMiddleware");
const router = express.Router();

router.post(
  "/create",
  authVerification,
  authorizeRoles("Administrator", "Supervisor"),
  UploadImageCloudinary.single("user_image"),
  userController.userCreate
);
router.post(
  "/login",
  validateRequest(JoiUserValidationSchema.loginSchema),
  userController.userLogin
);
router.get("/logged-in-user", authVerification, userController.loggedInUser);

router.post(
  "/refresh-token",
  validateRequest(JoiUserValidationSchema.refreshTokenJoiSchema),
  userController.refreshToken
);
router.post("/logout", userController.logout);

router.delete(
  "/delete-user/:id",
  authVerification,
  authorizeRoles("Administrator"),
  userController.deleteUser
);
router.patch(
  "/update-my-profile",
  authVerification,
  userController.updateMyProfile
);
router.patch(
  "/update-user/:id",
  authVerification,
  authorizeRoles("Administrator", "Supervisor"),
  userController.updateUser
);
router.get("/get-all-user", authVerification, userController.getAllUser);

const userRouter = router;

module.exports = userRouter;
