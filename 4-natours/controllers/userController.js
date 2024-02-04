const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('./../utils/jwt');
const bcrypt = require('bcryptjs');
const User = require('./../models/userModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

//修改信息
exports.updateMe = catchAsync(async (req, res, next) => {

});