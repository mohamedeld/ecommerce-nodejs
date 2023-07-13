const Order = require("../Model/orderModel");
const stripe = require('stripe')('sk_test_51NTM8cJDDLq4EDFsvu7XDB90GLw4wdWLRzWG0zHzehmXKYGl9cgDx6XAP4RbQkQ2OX2wJVCFduIXRMRjth3Ggiv600kxJQkUuX');
const Cart = require("../Model/cartModel");
const Product = require("../Model/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createCashOrder = catchAsync(async (request,response,next)=>{
    const taxPrice = 0;
    const shippingPrice = 0;

    const cart = await Cart.findById(request.params.cartId);
    if(!cart){
        return next(new AppError("card not found",404));
    }
    const cartPrice = cart.priceAfterDiscount
      ? cart.priceAfterDiscount
      : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: request.user._id,
      cartItems: cart.cartItems,
      shippingAddress: request.body.shippingAddress,
      totalOrderPrice
    });
    if(order){
        const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
        }));
        await Product.bulkWrite(bulkOption, {});
        await Cart.findByIdAndDelete(request.params.cartId);
    }
    

    response.status(200).json({
        status:"success",
        data:order
    })
});
exports.filterOrderForLoggedUser = catchAsync(async(request,response,next)=>{
    if(request.user.role === "user"){
        request.filterObj = {user:request.user._id}
    }
    next();
})
exports.getAllOrders = factory.findAll(Order);
exports.getOrder = factory.findOne(Order);

exports.updateOrderToPaid = catchAsync(async (request,response,next)=>{
    const order = await Order.findById(request.params.id);
    if(!order){
        return next(new AppError("please enter valid id",404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updateOrder = await order.save();
    response.status(200).json({
      status: 'success',
      data:updateOrder
    });
});

exports.updateOrderToShipping = catchAsync(async (request,response,next)=>{
    const order = await Order.findById(request.params.id);
    if (!order) {
      return next(new AppError('please enter valid id', 404));
    }
    order.isDelivered= true;
    order.deliveredAt= Date.now();
    const updateOrder = await order.save();
    response.status(200).json({
      status: 'success',
      data: updateOrder,
    });
});

exports.checkSession = catchAsync(async(request,response,next)=>{
    const taxPrice = 0;
    const shippingPrice = 0;
    const cart = await Cart.findById(request.params.cartId);
    if(!cart){
        return next(new AppError("invalid cart id",404));
    }
    const cartPrice = cart.priceAfterDiscount
      ? cart.priceAfterDiscount
      : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          name: request.user.name,
          amount: totalOrderPrice * 100,
          currency: 'usd',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.protocol}://${request.get('host')}/order`,
      cancel_url: `${request.protocol}://${request.get('host')}/cart`,
      customer_email: request.user.email,
      client_reference_id: request.params.cartId,
      metadata: request.body.shippingAddress,
    });
    response.status(200).json({
        status:"success",
        session
    })
});