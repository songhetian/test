const User = require('./../models/userModel');
const mongoose = require('mongoose');
const catchAsync = require('./../utils/catchAsync');


exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await  User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm,
    });
    res.status(200).json({
        data : newUser
    });
});