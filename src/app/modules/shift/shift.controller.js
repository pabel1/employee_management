const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const shiftServices = require("./shift.services");

const shiftCreate = catchAsyncError(async (req, res) => {
  const result = await shiftServices.createShiftIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shift created successfully",
    data: {
      result,
    },
  });
});

const shiftController = {
  shiftCreate,
};
module.exports = shiftController;
