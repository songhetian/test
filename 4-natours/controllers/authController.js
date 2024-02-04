const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('./../utils/jwt');
const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createSendToken = (user,statusCode, res) => {
  const token =  signToken(user._id);

    return res.status(statusCode).json({
      message: '注册成功',
      token,
      data: user
    });
}
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt : req.body.passwordChangeAt,
    role : req.body.role
  });
  const token = await signToken(newUser._id);

  res.status(200).json({
    message: '注册成功',
    token,
    data: newUser
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //检测输入账号密码
  if (!email || !password) {
    return next(new appError('请输入账号和密码', 400));
  }
  //验证账号密码是否正确
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('账号和密码错误', 401));
  }
  //生成token
  const token = await  signToken(user._id);

  res.status(200).json({
    message: '登录成功',
    token,
    data: user
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new appError('无效的token', 401));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if ( currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new appError('无效的token', 401));
  }

  //验证结束
  req.user =currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(res.currentUser.role)) {
          return next(new appError("没有权限!",401));
      }
    next();
  }
}

exports.forgetPassword = catchAsync(async (req, res, next) =>  {
    //1.查找用户
    const user = await User.findOne({email: req.body.email});
    if(!user) {
      return next(new appError("没有该用户",401));
    }

    //2.验证token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave : false});

    //3.发送邮件
    res.status(200).json({
      token : resetToken,
      url : `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`
    });
});

exports.resetPassword = catchAsync(async (req, res , next) => {
  //1.通过token查找用户 异步的
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await  User.findOne({
    passwordResetToken : hashedToken,
    passwordResetExpires : {$gt : Date.now()}
  });
  if(!user) {
    return next(new appError('token已经过期',400))
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passpasswordResetTokenword = undefined;
  user.passwordResetExpires = undefined;
  await  user.save();
  //3.修改密码修改时间
  const token = await  signToken(user._id);
  //4.用户登录  发送jwt
      res.status(200).json({
        token : token
      })
});

exports.updatePassword = catchAsync(async (req, res , next ) => {

  //获取用户
  const user = await  User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //登录更新jwt
  createSendToken(user,200,res);
});
