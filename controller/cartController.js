const Cart = require("../Model/cartModel");
const Product = require("../Model/productModel");
const Coupon = require("../Model/couponModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const calcTotalCartPrice = (cart)=>{
    let totalPrice = 0;
    cart.cartItems.forEach(item=> {
        totalPrice += item.quantity * item.price
    });
    return totalPrice;
}

exports.addProductToCart = catchAsync(async(request,response,next)=>{
    const {productId,color} = request.body;
    const product = await Product.findById(productId)
    let cart = await Cart.findOne({user:request.user._id});
    if(!cart){
        cart = await Cart.create({
          user: request.user._id,
          cartItems: [{ product: productId,color,price:product.price }],
        });
    }else{
        // check if cart items array has any item
        const productIndex = cart.cartItems.findIndex(item => {
            return item.product.toString() === productId && item.color === color;
        })
        // get index of cart and increase quantity and add cart item to cart items array
        if(productIndex > -1){
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity +=1;
            cart.cartItems[productIndex] = cartItem;
        }else{
            cart.cartItems.push({product:productId,color,price:product.price});
        }
    }
    const totalPrice = calcTotalCartPrice(cart);
    cart.totalCartPrice = totalPrice;
    await cart.save();
    response.status(200).json({
        status:"success",
        data:cart
    })
});

exports.getCartForLoggedUser = catchAsync(async (request,response,next)=>{
    const cart = await Cart.findOne({user:request.user._id});
    if(!cart){
        return next(new AppError("please login in",401));
    }
    response.status(200).json({
        status:"success",
        numberOfCarts:cart.cartItems.length,
        data:cart
    })
});

exports.removeLoggedUserCart = catchAsync(async (request,response,next)=>{
    const cart = await Cart.findOneAndUpdate({user:request.user._id},{
        $pull:{cartItems:{_id:request.params.itemId}}
    },{new:true});
    calcTotalCartPrice(cart);
    cart.save();
    response.status(200).json({
        status:"success",
        message:"deleted successfully"
    })
});

exports.clearLoggedUserCart = catchAsync(async (request,response,next)=>{
    const cart = await Cart.findOneAndDelete({user:request.user._id});
    response.status(200).json({
        status:"success",
        message:"all carts are deleted"
    })
});

exports.updateCartItemQuantity = catchAsync(async (request,response,next)=>{
    const {quantity} = request.body;
    const cart = await Cart.findOne({user:request.user._id});
    if(!cart){
        return next(new AppError("there is no cart",404));
    }
    const cartIndex = cart.cartItems.findIndex(item=> item._id.toString() === request.params.itemId);
    if(cartIndex>-1){
        const cartItem = cart.cartItems[cartIndex];
        cartItem.quantity = quantity;
        cart.cartItems[cartIndex] = cartItem;
    }else{
        return next(new AppError("there is no item for this cart",404));
    }
    calcTotalCartPrice(cart);
    await cart.save();
    response.status(200).json({
      status: 'success',
      data: cart,
    });
});

exports.applyCoupon = catchAsync(async (request,response,next)=>{
    const coupon = await Coupon.findOne({name:request.body.name,expire:{$gt:Date.now()}});
    if(!coupon){
        return next(new AppError("invalid or expire coupon",404));
    }
    const cart = await Cart.findOne({user:request.user._id});
    const totalPrice = cart.totalCartPrice;
    const totalPriceAfterDiscount =( totalPrice - (totalPrice * coupon.discount)/ 100).toFixed(2);
    cart.priceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
    response.status(200).json({
        status:"success",
        data:cart
    })
})