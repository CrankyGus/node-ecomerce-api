const jwt = require('jsonwebtoken');

const authStatus = require('../json/auth.json');
const sucessAuth = authStatus.sucess;
const errorAuth = authStatus.error;
const CryptoJs = require('crypto-js');

const verifytoken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json(errorAuth.token_invalid);
      req.user = user;
      next();
    });
  } else {
    res.status(401).json(errorAuth.not_authenticated);
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json(errorAuth.not_allowed);
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    req.user.isAdmin ? next() : res.status(403).json(errorAuth.not_allowed);
  });
};

module.exports = { verifytoken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
