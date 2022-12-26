const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const authStatus = require("../json/auth.json");
const sucessAuth = authStatus.sucess;
const errorAuth = authStatus.error;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    return res.status(403).json(errorAuth.incomplete_info);
  }

  if (password.length < 6) {
    return res.status(403).json(errorAuth.password_min);
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(409).json(errorAuth.username_email_exists);
  }

  const newUser = new User({
    username: username,
    email: email,
    password: CryptoJs.AES.encrypt(
      password,
      process.env.ENCRYPT_SECRET
    ).toString(),
  });

  try {
    const addUser = await newUser.save();
    res.status(201).json({ ...sucessAuth.registration, user_data: addUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  const { username } = req.body;
  if (!username || !req.body.password) {
    return res.status(403).json(errorAuth.incomplete_info);
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json(errorAuth.invalid_credentials);
  }

  const decryptedPassword = CryptoJs.AES.decrypt(
    user.password,
    process.env.ENCRYPT_SECRET
  ).toString(CryptoJs.enc.Utf8);

  if (decryptedPassword !== req.body.password) {
    return res.status(401).json(errorAuth.invalid_credentials);
  }

  const { password, ...others } = user._doc;

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ ...sucessAuth.login, token, user_data: others });
});

module.exports = router;
