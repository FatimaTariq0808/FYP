const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Constructor = mongoose.model("Constructor");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in. " });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in. " });
    }

    const { userId } = payload;

    const client = await User.findById(userId);
    const constructor = await Constructor.findById(userId);
    if (client) {
      req.user = client;
      // console.log(req.user);
      next();
    } else {
      req.user = constructor;
      next();
    }
  });
};
