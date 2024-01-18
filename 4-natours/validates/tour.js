const {body , param, validationResult} = require('express-validator');
const validate = require('./../middleware/validate');
const Tour = require('./../models/tourModel');


module.exports.createTour = validate([
    body('name').notEmpty().withMessage("姓名不能为空")
]);

module.exports.getTours = validate([
  param('id').isMongoId().withMessage("id格式不符合").bail()
    .custom(async  id => {
        const tour = await  Tour.findById(id);
        if (!tour) {
          return Promise.reject("没有该行程");
        }
    })
]);