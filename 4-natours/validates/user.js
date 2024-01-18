const User = require('./../models/userModel');
const {body , validationResult} =require('express-validator');
const validate = require('./../middleware/validate');
const AppError = require('./../utils/appError');
exports.signup = [
  validate([
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').notEmpty().withMessage('邮箱不能为空')
                     .isEmail().withMessage('邮箱格式不符合')
                     .bail()
    .custom(async email => {
      const user = await User.findOne({ email : email});
      if(user) {
        return Promise.reject("邮箱已经存在");
      }
    }),
  body('password').notEmpty().withMessage('密码不能为空')
    .isLength({min:8,max:20}).withMessage('密码最低为8位'),
  body('passwordConfirm').notEmpty().withMessage('确认密码不能为空')
    .isLength({min:8,max:20}).withMessage('密码最低为8位')
    .custom((el , {req }) => {
        if (el !== req.body.password) {
          throw new Error("两次密码不一致")
          //return Promise.reject("两次密码不一致")
        }
    })
]),
  async (req, res, next) => {
      if (req.body.password !== req.body.passwordConfirm) {

      }
      next();
  }
];