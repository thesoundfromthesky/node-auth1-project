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
      req.session.username = user.username;
      res.status(200).json({ message: "login success" });
    } else {
      res.status(200).json({ message: "login fail" });
    }
  } catch {
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const users = await usersTbl.find();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("good bye");
      }
    });
  }
});

function authenticate(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "Login first" });
  }
}
module.exports = router;
