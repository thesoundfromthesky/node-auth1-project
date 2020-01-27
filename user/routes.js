const express = require("express");
const usersTbl = require("./controllers");
const mw = require("./middlewares");
const bcryptjs = require("bcryptjs");
const router = express.Router();

// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.                                                                                                                                                         |
// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!' |
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.                                                                                                |

router.post("/register", mw.validateUser, async (req, res) => {
  try {
    req.body.password = bcryptjs.hashSync(req.body.password);
    const isCreated = await usersTbl.create(req.body);
    res.status(200).json({ message: "Account has been created" });
  } catch {
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [user] = await usersTbl.findBy(username);
    const isAuthenticated = bcryptjs.compareSync(password, user.password);
    if (isAuthenticated) {
      res.cookie("token", "pass", {
        maxAge: 900000,
        httpOnly: true
      });
      res.status(200).json({ message: "login success" });
    } else {
      res.status(200).json({ message: "login fail" });
    }
  } catch {
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    if (req.cookies.token === "pass") {
      const users = await usersTbl.find();
      res.status(200).json(users);
    } else {
      res.status(401).json({ message: "login first" });
    }
  } catch {
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

module.exports = router;
