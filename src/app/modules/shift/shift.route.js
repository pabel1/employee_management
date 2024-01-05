/* eslint-disable node/no-extraneous-require */
const express = require("express");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiShiftValidationSchema = require("./shift.validation");
const shiftController = require("./shift.controller");
const authVerification = require("../../../Middleware/authVarification");
const { authorizeRoles } = require("../../../Middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/create",
  validateRequest(JoiShiftValidationSchema.shiftCreateValidationSchema),
  authVerification,
  authorizeRoles("Administrator", "Supervisor"),
  shiftController.shiftCreate
);
router.get("/get-all", shiftController.getAllShift);

const shiftRouter = router;

module.exports = shiftRouter;
