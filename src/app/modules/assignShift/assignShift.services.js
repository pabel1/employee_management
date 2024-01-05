const { default: mongoose } = require("mongoose");
const startOfDayEndOfDay = require("../../../utility/startOfDayEndOfDay");
const AssignShiftModel = require("./assignShift.model");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const httpStatus = require("http-status");

const createAssignShiftIntoDB = async (payload) => {
  const { startOfDay, endOfDay } = startOfDayEndOfDay(payload?.date);
  const object = new mongoose.Types.ObjectId(payload?.assignEmployee);
  const isExist = await AssignShiftModel.aggregate([
    {
      $match: {
        $and: [
          { date: { $gte: startOfDay, $lte: endOfDay } },
          { assignEmployee: object },
        ],
      },
    },
  ]);
  console.log(isExist);
  if (isExist.length) {
    throw new ErrorHandler(
      `${
        isExist[0]?.shiftName ? isExist[0]?.shiftName : isExist[0].shiftID
      } this Shift already Assigned for this Employee!`,
      httpStatus.CONFLICT
    );
  }

  const assignShift = new AssignShiftModel(payload);
  const newShift = await assignShift.save();

  return newShift;
};

const assignShiftServices = {
  createAssignShiftIntoDB,
};
module.exports = assignShiftServices;
