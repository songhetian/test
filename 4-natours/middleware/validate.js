const express = require('express');
const { validationResult } = require('express-validator');
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
module.exports =  validate = validations => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};