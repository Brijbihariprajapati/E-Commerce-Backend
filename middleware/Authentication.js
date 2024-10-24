const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  console.log('token', req.header('Authorization'));

  if (!req.header('Authorization')) {
    return res.status(401).json({ msg: 'Authorization header missing' });
  }

  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error('Invalid token:', error);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = protect;
