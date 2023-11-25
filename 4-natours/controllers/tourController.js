const fs = require('fs');
const express = require('express');

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.checkID = (req, res, next, val) => {
  const tour = tours.find(el => el.id === +val);
  if (!tour) {
    return res.status(404).json({
      status: 'Filed not found',
      message: 'No tour found'
    });
  }
  res.tour = tour;
  next();
};

exports.checkBody = (req, res, next) => {
  const data = req.body;
  if (!data.name || !data.price) {
    return res.status(404).json({
      status: 'Filed not found',
      message: 'No tour found'
    });
  }
  console.log(req.body);
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
};

exports.getTour = (req, res) => {
  const { tour } = res;
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

exports.creatTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        message: 'success',
        data: {
          data: newTour
        }
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const { tour } = res;
  for (const key in req.body) {
    tour[key] = req.body[key];
  }
  tours.filter(el => {
    if (el.id === id) {
      return (el = tour);
    }
  });

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      console.log('write success');
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      tours: tours
    }
  });
};

exports.deleteTour = (req, res) => {
  const { id } = res.tour;
  const index = tours.findIndex(el => el.id === id);
  if (index === -1) {
    res.status(404).json({
      status: 'Filled',
      message: 'No tour found!'
    });
  }
  tours.splice(index, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      console.log('write success');
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      index: index
    }
  });
};
