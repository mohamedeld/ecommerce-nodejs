const categoryRouter = require('./categoryRoutes');
const subCategoryRouter = require('./subCategoryRouter');
const brandRouter = require('./brandRoutes');
const productRouter = require('./productRoutes');
const userRouter = require('./userRoutes');
const authRouter = require('./authRoutes');
const reviewRouter = require('./reviewRoutes');
const wishListRouter = require('./wishListRoute');
const addressRouter = require('./addressRoutes');
const couponRouter = require('./couponRoutes');
const cartRouter = require("./cartRoutes");
const orderRouter = require("./orderRoutes");

const mountRoutes = (app) => {
  app.use('/users', userRouter);
  app.use('/auth', authRouter);
  app.use('/category', categoryRouter);
  app.use('/subCategory', subCategoryRouter);
  app.use('/brand', brandRouter);
  app.use('/products', productRouter);
  app.use('/review', reviewRouter);
  app.use('/wishlist', wishListRouter);
  app.use('/address', addressRouter);
  app.use('/coupon', couponRouter);
  app.use('/cart',cartRouter);
  app.use('/order',orderRouter);
};

module.exports = mountRoutes;
