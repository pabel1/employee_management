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
const assignShiftEmployeeFromDB = async (id) => {
  const object = new mongoose.Types.ObjectId(id);

  console.log(object);
  const shifts = await AssignShiftModel.aggregate([
    {
      $match: {
        $and: [{ shiftID: object }],
      },
    },
    {
      $lookup: {
        from: "shifts",
        localField: "shiftID",
        foreignField: "_id",
        as: "Shift",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignEmployee",
        foreignField: "_id",
        as: "Employee",
      },
    },
    {
      $unwind: {
        path: "$Shift",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$Employee",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "Shift.shiftName": 1,
        "Shift.date": 1,
        "Shift.startTime": 1,
        "Shift.endTime": 1,
        "Employee._id": 1,
        "Employee.photo": 1,
        "Employee.name": 1,
        "Employee.email": 1,
      },
    },
  ]);

  return shifts;
};
const removeShiftEmployeeFromDB = async (shiftID) => {
  const shift = await AssignShiftModel.findById(shiftID);
  if (!shift) {
    throw new ErrorHandler("Shift not found", httpStatus.NOT_FOUND);
  }
  const result = await AssignShiftModel.deleteOne({ _id: shiftID });
  return {
    result,
  };
};

const assignShiftServices = {
  createAssignShiftIntoDB,
  assignShiftEmployeeFromDB,
  removeShiftEmployeeFromDB,
};
module.exports = assignShiftServices;
