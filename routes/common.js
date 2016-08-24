
function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).send({
      message: 'login required'
    });
  }
  next();
}

function isSecure(req, res, next) {
  if (!req.secure) {
    return res.status(426).send({
      message: 'upgrade required'
    });
  }
  next();
}


module.exports.isSecure = isSecure;
module.exports.isAuthenticated = isAuthenticated;