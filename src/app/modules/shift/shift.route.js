/* eslint-disable node/no-extraneous-require */
const express = require("express");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiShiftValidationSchema = require("./shift.validation");
const shiftController = require("./shift.controller");

const router = express.Router();

router.post(
  "/create",
  validateRequest(JoiShiftValidationSchema.shiftCreateValidationSchema),
  shiftController.shiftCreate
);
router.get("/get-all", shiftController.getAllShift);

const shiftRouter = router;

module.exports = shiftRouter;
