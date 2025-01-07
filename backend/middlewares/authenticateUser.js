const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRETKEY);

    // Attach user data to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
