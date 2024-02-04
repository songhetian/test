const express = require('express');
const UserValidator = require('./../validates/user');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/signup')
      .post(authController.signup)
router.route('/login')
      .post(authController.login)
router.post('/forgetPassword',authController.forgetPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updatePassword',authController.protect,authController.updatePassword)

module.exports = router;