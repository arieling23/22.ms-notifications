const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(403);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

module.exports = verifyJWT;
