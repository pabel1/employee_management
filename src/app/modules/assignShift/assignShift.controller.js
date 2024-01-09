const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const assignShiftServices = require("./assignShift.services");

const assignShiftCreate = catchAsyncError(async (req, res) => {
  const result = await assignShiftServices.createAssignShiftIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shift Assign created successfully",
    data: {
      result,
    },
  });
});

const assignShiftEmployee = catchAsyncError(async (req, res) => {
  const result = await assignShiftServices.assignShiftEmployeeFromDB(
    req.params
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Assign Shift get successfully",
    data: {
      result,
    },
  });
});
const removeEmployeeShift = catchAsyncError(async (req, res) => {
  console.log(req.params);
  const result = await assignShiftServices.removeShiftEmployeeFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Remove Assign Shift  successfully",
    data: {
      result,
    },
  });
});

// loinUser shift
const loggedInEmployeeShift = catchAsyncError(async (req, res) => {
  console.log(req.user._id);
  const result = await assignShiftServices.loggedInEmployeeShiftFromDB(
    req.user._id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Assign Shift get successfully",
    data: {
      result,
    },
  });
});
const assignShiftController = {
  assignShiftCreate,
  assignShiftEmployee,
  removeEmployeeShift,
  loggedInEmployeeShift,
};
module.exports = assignShiftController;
