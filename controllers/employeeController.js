'use strict'

var varemployeeController = require('./employeeControllerService');

module.exports.createEmployee = function createEmployee(req, res, next) {
  varemployeeController.createEmployee(req.swagger.params, res, next);
};

module.exports.showEmployeeById = function showEmployeeById(req, res, next) {
  varemployeeController.showEmployeeById(req.swagger.params, res, next);
};

module.exports.deleteEmployee = function deleteEmployee(req, res, next) {
  varcustomerController.deleteEmployee(req.swagger.params, res, next);
};