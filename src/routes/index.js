const express = require("express");

const userRouter = require("../app/modules/user/user.route");
const shiftRouter = require("../app/modules/shift/shift.route");
const assignShiftRouter = require("../app/modules/assignShift/assignShift.route");

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/shift",
    route: shiftRouter,
  },
  {
    path: "/assign-shift",
    route: assignShiftRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
