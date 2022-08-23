const responseStatusCode = require('./responseCode');

exports.successResponse = (data, res) => res.status(responseStatusCode.success).json({
  status: 'SUCCESS',
  message: 'Your request is successfully executed',
  data,
});

exports.failureResponse = (data, res) => res.status(responseStatusCode.internalServerError).json({
  status: 'FAILURE',
  message: 'Internal Server Error',
  data: {},
});

exports.badRequest = (data, res) => res.status(responseStatusCode.badRequest).json({
  status: 'BAD_REQUEST',
  message: 'The request cannot be fulfilled due to bad syntax',
  data: {},
});

exports.validationError = (data, res) => res.status(responseStatusCode.validationError).json({
  status: 'VALIDATION_ERROR',
  message: `Invalid Data, Validation Failed at {$data}`,
  data: {},
});

exports.isDuplicate = (data, res) => res.status(responseStatusCode.validationError).json({
  status: 'VALIDATION_ERROR',
  message: 'Data Duplication Found',
  data: {},
});

exports.recordNotFound = (data, res) => res.status(responseStatusCode.success).json({
  status: 'RECORD_NOT_FOUND',
  message: 'Record not found with specified criteria.',
  data: {},
});

exports.insufficientParameters = (res) => res.status(responseStatusCode.badRequest).json({
  status: 'BAD_REQUEST',
  message: 'Insufficient parameters',
  data: {},
});

exports.dbError = (err, res) => res.status(responseStatusCode.internalServerError).json({
  status: 'FAILURE',
  message: 'db related error',
  data: {},
});

exports.inValidParam = (err, res) => res.status(responseStatusCode.validationError).json({
  status: 'VALIDATION_ERROR',
  message: `Invalid values in parameters, ${err}`,
  data: {},
});

exports.unAuthorizedRequest = (err, res) => res.status(responseStatusCode.unAuthorizedRequest).json({
  status: 'UNAUTHORIZED',
  message: 'You are not authorized to access the request',
  data: {},
});

exports.loginSuccess = (data, res) => res.status(responseStatusCode.success).json({
  status: 'SUCCESS',
  message: 'Login Successful',
  data,
});

exports.passwordEmailWrong = (res) => res.status(responseStatusCode.unAuthorizedRequest).json({
  status: 'UNAUTHORIZED',
  message: 'email or password may be wrong',
  data: {},
});
exports.loginFailed = (data, res) => res.status(responseStatusCode.unAuthorizedRequest).json({
  status: 'UNAUTHORIZED',
  message: `Login Failed, ${data}`,
  data: {},
});
exports.failedSoftDelete = (res) => res.status(responseStatusCode.internalServerError).json({
  status: 'FAILURE',
  message: 'Data can not be deleted due to internal server error',
  data: {},
});
exports.changePasswordFailure = (data, res) => res.status(responseStatusCode.success).json({
  status: 'FAILURE',
  message: `Password cannot be changed due to ${data}`,
  data: {},
});
exports.changePasswordSuccess = (data, res) => res.status(responseStatusCode.success).json({
  status: 'SUCCESS',
  message: data,
  data: {},
});
