const Joi = require("joi");

const shiftCreateValidationSchema = Joi.object({
  shiftName: Joi.string()
    .valid("Day", "Night", "Morning")
    .required()
    .label("Shift Name"),
  date: Joi.date().label("Date"),
  startTime: Joi.string().required().label("Start Time"),
  endTime: Joi.string().required().label("End Time"),
});

const JoiShiftValidationSchema = {
  shiftCreateValidationSchema,
};

module.exports = JoiShiftValidationSchema;
