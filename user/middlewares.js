module.exports = { validateUser, throwInternalServerError };

function validateUser(req, res, next) {
  const { username, password } = req.body;
  isUndefined({ username, password });
  next();
}

function isUndefined(obj) {
  const target = [];
  for (const prop in obj) {
    if (!obj[prop]) {
      target.push(prop);
    }
  }
  if (target.length) {
    throwBadRequest(`${target} undefined`);
  }
}

function throwBadRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.error = "Bad Request";
  throw error;
}

function throwInternalServerError(message) {
  const error = new Error(message);
  error.statusCode = 500;
  error.error = "Internal Server Error";
  throw error;
}
