const fs = require('fs');
const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

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
  .post(tourController.creatTour);

router.route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;