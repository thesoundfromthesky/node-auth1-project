const express = require("express");
const usersTbl = require("./controllers");
const mw = require("./middlewares");
const router = express.Router();

// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.                                                                                                                                                         |
// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!' |
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.                                                                                                |

router.post("/register", mw.validateUser, async (req, res) => {
  try {
    const isCreated = await usersTbl.create(req.body);
    res.status(200).json({ message: "Account has been created" });
  } catch {
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

router.post("/login", (req, res) => {});
router.get("/", async (req, res) => {
  try {
    const users = await usersTbl.find();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

module.exports = router;
