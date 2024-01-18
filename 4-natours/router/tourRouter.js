const fs = require('fs');
const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const tourValidator = require('./../validates/tour');

//router.param('id',tourController.checkID);
// router.use((req, res,next) => {
//   console.log("woshiceshi");
//   next();
//
// });
router.route('/top-tours')
  .get(tourController.getTopTours,tourController.getAllTours);

router.route('/month-plan/:year')
  .get(tourController.getMonthlyPlan);

router.route('/get-tour-status')
  .get(tourController.getStatusTours);

router.route('/')
  .get(tourController.getAllTours)
  .post(tourValidator.createTour,tourController.creatTour);

router.route('/:id')
  .get(tourValidator.getTours ,tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;