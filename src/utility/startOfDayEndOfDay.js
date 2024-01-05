const moment = require("moment/moment");
function startOfDayEndOfDay(date) {
  let startOfDay, endOfDay;
  if (date) {
    startOfDay = moment(date).startOf("day").toDate();
    endOfDay = moment(date).endOf("day").toDate();
  } else {
    startOfDay = moment().startOf("day").toDate();
    endOfDay = moment().endOf("day").toDate();
  }

  return { startOfDay, endOfDay };
}

module.exports = startOfDayEndOfDay;
