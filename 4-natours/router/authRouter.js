const express = require('express');
const UserValidator = require('./../validates/user');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/signup')
      .post(authController.signup)

module.exports = router;