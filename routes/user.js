const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  //   const { password } = req.body;
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.ENCRYPT_SECRET).toString();
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json({ msg: 'Sucess !', updateUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  const { id } = req.params;
  const result = await deleteUser(id);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  const { id } = req.params;
  const result = await findUserById(id);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;