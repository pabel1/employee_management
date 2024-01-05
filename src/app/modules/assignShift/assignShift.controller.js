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

const assignShiftController = {
  assignShiftCreate,
};
module.exports = assignShiftController;
