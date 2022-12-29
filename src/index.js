require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('../routes/user');
const authRoute = require('../routes/auth');
const productRoute = require('../routes/product');
const cartRoute = require('../routes/cart');
const orderRoute = require('../routes/order');
const cors = require('cors')

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`[INFO]: MongoDB Connected!`);
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);

app.listen(port, () => {
  console.log(`[INFO]: Server Starting...`);
  console.log(`[INFO]: Server Started on port ${port}`);
});
