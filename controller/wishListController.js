const User = require("../Model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addProductToWishList = catchAsync(async (request,response,next)=>{
    const user =await User.findByIdAndUpdate(request.user._id,{
        $addToSet:{wishlist:request.body.productId}
    },{new:true});
    if(!user){
        return next(new AppError("please login",401));
    }

    response.status(200).json({
        status:"success",
        message:"product added to your wishlist successfully",
        data:user.wishlist,
        
    })
});

exports.removeProductFromWishList = catchAsync(async (request,response,next)=>{
    const user = await User.findByIdAndUpdate(request.user._id,{
        $pull:{wishList:request.params.productId}
    },{new:true})
    if (!user) {
      return next(new AppError('please login', 401));
    }

    response.status(200).json({
      status: 'success',
      message: 'product deleted from your wishlist successfully',
      data: user.wishlist,
    });
});

exports.getLoggedUserWishList = catchAsync(async (request,response,next)=>{
    const user = await User.findById(request.user._id).populate('wishlist');

    response.status(200).json({
        status:"success",
        data:user
    })
})