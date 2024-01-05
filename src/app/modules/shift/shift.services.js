const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const {
  compositeKeyGenerator,
} = require("../../../Helper/compositeKeyGenerator");
const ShiftModel = require("./shift.model");

const createShiftIntoDB = async (payload) => {
  const compositeKey = compositeKeyGenerator.generateCompositKey({
    keyFor: "shift",
    firstField: payload?.shiftName,
    secondField: payload?.startTime,
  });

  const isExist = await ShiftModel.findOne({
    compositeKey,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.shiftName} this Shift already exist!`,
      httpStatus.CONFLICT
    );
  }

  const shift = new ShiftModel(payload);
  const newShift = await shift.save();

  return newShift;
};

const shiftServices = {
  createShiftIntoDB,
};
module.exports = shiftServices;
