const mongoose = require("mongoose");
const {
  compositeKeyGenerator,
} = require("../../../Helper/compositeKeyGenerator");

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
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    compositeKey: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// composite key created for uniqueness
shiftSchema.pre("save", function (next) {
  this.compositeKey = compositeKeyGenerator.generateCompositKey({
    keyFor: "shift",
    firstField: this.shiftName,
    secondField: this.startTime,
  });
  next();
});

const ShiftModel = mongoose.model("Shift", shiftSchema);

module.exports = ShiftModel;
