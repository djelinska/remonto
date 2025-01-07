const jwt = require("jsonwebtoken");
function generateToken(user) {
  const payload = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    type: user.type,
  };
  // 7 days -> 7days*24h*60min*60sec
  const expiresIn = 7 * 24 * 60 * 60;
  const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn });
  return token;
}
module.exports = generateToken;
