const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Constants = require("./constants");
const userRepo = require("../repos/userRepo")

exports.isEmptyObject = (object) => Object.entries(object).length === 0;

exports.isPasswordCorrect = async function (key, password) {
  return bcrypt.compare(password, key).then((result) => result);
};

exports.getUsernameFromToken = (token) => jwt.decode(token)["sub"];

exports.getAudienceFromToken = (token) => jwt.decode(token)["aud"];

exports.generateToken = async function (prevToken, userName) {
  console.log("generateToken...")
  const name = userName || getUsernameFromToken(prevToken);
  const user = await userRepo.getUser(userName);
  const role = user.role;
  console.log("role: "+role)
  const options = {
    algorithm: process.env.ALGORITHM,
    expiresIn: process.env.EXPIRY,
    issuer: process.env.ISSUER,
    subject: name,
    audience:
      role === "Staff"
        ? Constants.JWT_OPTIONS.ADMIN_AUDIENCE
        : Constants.JWT_OPTIONS.MEMBER_AUDIENCE,
  };
  return jwt.sign({}, process.env.SECRET, options);
};

exports.verifyToken = (req, res, next) => {
  if (!req.headers.authorization)
    res.status(401).send({ message: "Not authorized to access data" });
  else {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      res.status(401).send({ message: "Not Authorized to access data" });
    else {
      jwt.verify(token, process.env.SECRET, function (err) {
        if (err) {
          res.status(401).send({ message: "Please login again" });
        } else next();
      });
    }
  }
};