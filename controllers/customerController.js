'use strict'

var varcustomerController = require('./customerControllerService');

module.exports.updateEmployee = function updateEmployee(req, res, next) {
  varcustomerController.updateEmployee(req.swagger.params, res, next);
};