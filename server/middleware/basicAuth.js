const auth = require("basic-auth");

async function basicAuth(req, res, next) {
  const user = await auth(req);
  //Here comes the authentication
  const userName = "test";
  if (user && user.name.toLocaleLowerCase() === userName) {
    next();
  } else {
    res.status(401).send("Access denied");
  }
}

module.exports = basicAuth;
