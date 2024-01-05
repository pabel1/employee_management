const Joi = require("joi");

const assignShiftCreateValidationSchema = Joi.object({
  shiftID: Joi.string().hex().length(24).required().label("Shift ID"),
  shiftName: Joi.string().hex().length(24).label("Shift Name"),
  date: Joi.date().required().label("Date"),
  assignEmployee: Joi.string()
    .hex()
    .length(24)
    .required()
    .label("Assigned Employee ID"),
});

const JoiAssignShiftValidationSchema = {
  assignShiftCreateValidationSchema,
};

module.exports = JoiAssignShiftValidationSchema;
