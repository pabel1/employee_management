const Joi = require("joi");

const shiftCreateValidationSchema = Joi.object({
  shiftName: Joi.string().valid("Day", "Night").required().label("Shift Name"),
  date: Joi.date().label("Date"),
  startTime: Joi.date().required().label("Start Time"),
  endTime: Joi.date().required().label("End Time"),
});

const JoiShiftValidationSchema = {
  shiftCreateValidationSchema,
};

module.exports = JoiShiftValidationSchema;
