const express = require("express");

const userRouter = require("../app/modules/user/user.route");

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
