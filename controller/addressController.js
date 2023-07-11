const User =require("../Model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addAddressToUser = catchAsync(async(request,response,next)=>{
    const user = await User.findByIdAndUpdate(
      request.user._id,
      {
        $addToSet: { addresses: request.body },
      },
      { new: true }
    );
    if(!user){
        return next(new AppError("invalid user",401));
    }
    response.status(200).json({
      status: 'success',
      message: 'added successfully to user',
      data: user.addresses,
    });
});

exports.removeAddressFromUser = catchAsync(async(request,response,next)=>{
    const user = await User.findByIdAndUpdate(request.user._id, {
      $pull: { addresses: {_id:request.params.addressId} },
    });
    if (!user) {
      return next(new AppError('invalid user', 401));
    }
    response.status(200).json({
      status: 'success',
      message: 'deleted address successfully from user',
      data: user.addresses,
    });
});

exports.getAddressForloggedUser = catchAsync(async(request,response,next)=>{
    const user = await User.findById(request.user._id).populate('addresses');
    if (!user) {
      return next(new AppError('invalid user', 401));
    }
    response.status(200).json({
      status: 'success',
      data: user,
    });
})