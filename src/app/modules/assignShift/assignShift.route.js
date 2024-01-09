/* eslint-disable node/no-extraneous-require */
const express = require("express");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiAssignShiftValidationSchema = require("./assignShift.validation");
const assignShiftController = require("./assignShift.controller");
const authVerification = require("../../../Middleware/authVarification");
const { authorizeRoles } = require("../../../Middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/create",
  authVerification,
  authorizeRoles("Administrator", "Supervisor"),
  validateRequest(
    JoiAssignShiftValidationSchema.assignShiftCreateValidationSchema
  ),
  assignShiftController.assignShiftCreate
);

router.get(
  "/shift-assign-details/:id",
  authVerification,
  authorizeRoles("Administrator", "Supervisor"),
  assignShiftController.assignShiftEmployee
);
router.delete(
  "/remove-assign-shift/:id",
  authVerification,
  authorizeRoles("Administrator", "Supervisor"),
  assignShiftController.removeEmployeeShift
);

const assignShiftRouter = router;

module.exports = assignShiftRouter;
