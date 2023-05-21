const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");

exports.signUp = async (request, response, next) => {
  try {
    const user = await User.create({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    });
    const token = user.genAuthToken();
    response.header("x-auth-token", token);

    response.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
      throw new Error("invalid email please sign up");
    }
    const validPassword = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!validPassword) {
      throw new Error("invalid password ");
    }
    const token = user.genAuthToken();
    response.header("x-auth-token", token);
    response.status(200).json({
      message: "logged in successfully",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
