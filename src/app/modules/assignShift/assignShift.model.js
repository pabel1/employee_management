const mongoose = require("mongoose");

const assignShiftSchema = new mongoose.Schema(
  {
    shiftID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    shiftName: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },
    assignEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const AssignShiftModel = mongoose.model("AssignShift", assignShiftSchema);

module.exports = AssignShiftModel;
