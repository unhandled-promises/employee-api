'use strict'

module.exports.createEmployee = function createEmployee(req, res, next) {
  res.send({
    message: 'This is the mockup controller for createEmployee'
  });
};

module.exports.showEmployeeById = function showEmployeeById(req, res, next) {
  res.send({
    message: 'This is the mockup controller for showEmployeeById'
  });
};

module.exports.deleteEmployee = function deleteEmployee(req, res, next) {
  res.send({
    message: 'This is the mockup controller for deleteEmployee'
  });
};