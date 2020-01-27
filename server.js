const express = require("express");
const userRoute = require("./user/routes");
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/users", userRoute);

server.use((err, req, res, next) => {
    console.log("error trigerred");
  const { statusCode, error, message } = err;
  if (statusCode) {
    res.status(statusCode).json({ statusCode, error, message });
  } else {
    res
      .status(500)
      .json({ StatusCode: 500, error: "Internal Server Error", message });
  }
});

module.exports = server;
