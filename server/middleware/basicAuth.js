async function basicAuth(req, res, next) {
  //Here comes the authentication
  next();
}

module.exports = basicAuth;
