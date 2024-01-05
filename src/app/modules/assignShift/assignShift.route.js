/* eslint-disable node/no-extraneous-require */
const express = require("express");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiAssignShiftValidationSchema = require("./assignShift.validation");
const assignShiftController = require("./assignShift.controller");

const router = express.Router();

router.post(
  "/create",
  validateRequest(
    JoiAssignShiftValidationSchema.assignShiftCreateValidationSchema
  ),
  assignShiftController.assignShiftCreate
);

const assignShiftRouter = router;

module.exports = assignShiftRouter;
