const express = require("express");

const userRouter = require("../app/modules/user/user.route");
const shiftRouter = require("../app/modules/shift/shift.route");

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
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
