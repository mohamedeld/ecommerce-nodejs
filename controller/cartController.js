const Cart = require("../Model/cartModel");
const Product = require("../Model/productModel");
const catchAsync = require("../utils/catchAsync");

exports.addProductToCart = catchAsync(async(request,response,next)=>{
    const {productId,color} = request.body;
    const product = await Product.findById(productId)
    const cart = await Cart.findOne({user:request.user._id});
    if(!cart){
        cart = await Cart.create({
          user: request.user._id,
          cartItems: [{ product: productId,color,price:product.price }],
        });
    }else{
        
    }

})