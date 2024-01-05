const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    shiftName: {
      type: String,
      enum: ["Day", "Night"],
    },

    date: {
      type: Date,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ShiftModel = mongoose.model("Shift", shiftSchema);

module.exports = ShiftModel;
