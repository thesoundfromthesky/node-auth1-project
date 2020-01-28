const express = require("express");
const session = require("express-session");

const cookieParser = require("cookie-parser");
const userRoute = require("./user/routes");
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
  session({
    name: "notsession", // default is connect.sid
    secret: "nobody tosses a dwarf!",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false, // The resave option forces the session to be saved back to the session store, even if the session wasn’t modified during the request.
    saveUninitialized: false // The saveUninitialized flag, forces a session that is “uninitialized” to be saved to the store. A session is uninitialized when it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.
  })
);

server.use("/api/users", userRoute);

server.use((err, req, res, next) => {
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
