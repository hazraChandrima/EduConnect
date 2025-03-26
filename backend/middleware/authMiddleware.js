const jwt = require('jsonwebtoken');

// ✅ Fix: Rename `authMiddleware` to `verifyToken`
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization"); 
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.split(" ")[1]; // ✅ Extract only the token

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach user info to `req.user`
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// ✅ Fix: Use `req.user` after `verifyToken` is called
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

// ✅ Export correctly
module.exports = { verifyToken, authorizeRoles };
