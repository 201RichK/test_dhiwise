const authService =  require('../../services/auth');
const utils = require('../../utils/messages');
const model = require('../../model/index');
const dbService = require('../../utils/dbService');
const moment = require('moment');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const { uniqueValidation } = require('../../utils/common');
    
module.exports = {
  /*
   * api: user register 
   * description : first time user registration.
   */
  register : async (req, res) => {
    try {
      let isValid = validation.validateParamsWithJoi(
        req.body,
        userSchemaKey.schemaKeys
      );
      if (isValid.error) {
        return utils.inValidParam(isValid.error, res);
      }
      let unique = await uniqueValidation(model.user,req.body);   
      if (!unique){ 
        return utils.inValidParam('User Registration Failed, Duplicate Data found',res);
      }     
      const result = await dbService.createOne(model.user,{ ...req.body });
      return  utils.successResponse(result, res);
    } catch (error) {
      return utils.failureResponse(error.message,res);
    }  
  },
  /*
   * api : forgot password
   * description : send email or sms to user for forgot password.
   */
  forgotPassword: async (req, res) => {
    const params = req.body;
    try {
      if (!params.email) {
        return utils.insufficientParameters(res);
      }
      let where = { email: params.email };
      params.email = params.email.toString().toLowerCase();
      let isUser = await dbService.findOne(model.user,where);
      if (isUser) {
        let {
          resultOfEmail,resultOfSMS
        } = await authService.sendResetPasswordNotification(isUser);
        if (resultOfEmail && resultOfSMS){
          return utils.successResponse('otp successfully send.', res);
        } else if (resultOfEmail && !resultOfSMS) {
          return utils.successResponse('otp successfully send to your email.', res);
        } else if (!resultOfEmail && resultOfSMS) { 
          return utils.successResponse('otp successfully send to your mobile number.', res);
        } else {
          return utils.failureResponse('otp can not be sent due to some issue try again later', res);
        }
      } else {
        return utils.recordNotFound('user not found', res);
      }
    } catch (error) {
      return utils.failureResponse(error, res);
    }
  },
  /*
   * api : validate forgot password otp 
   * description : after successfully sent mail or sms for forgot password validate otp
   */
  validateResetPasswordOtp: async (req, res) => {
    const params = req.body;
    try {
      if (!params || !params.otp) {
        return utils.insufficientParameters(res);
      }
      let isUser = await dbService.findOne(model.userAuthSettings, { resetPasswordCode: params.otp });
      if (!isUser || !isUser.resetPasswordCode) {
        return utils.successResponse('Invalid OTP', res);
      }
      // link expire
      if (moment(new Date()).isAfter(moment(isUser.expiredTimeOfResetPasswordCode))) {
        return utils.successResponse('Your reset password link is expired or invalid', res);
      }
      return utils.successResponse('Otp verified', res);
    } catch (error) {
      return utils.failureResponse(error.message, res);
    }
  },
  /*
   * api : reset password
   * description : after successfully sent email or sms for forgot password,
   *                validate otp or link and reset password
   */
  resetPassword : async (req, res) => {
    const params = req.body;
    try {
      if (!params.code || !params.newPassword) {
        return utils.insufficientParameters(res);
      }
      let userAuth = await dbService.findOne(model.userAuthSettings, { resetPasswordCode: params.code });
      if (userAuth && userAuth.expiredTimeOfResetPasswordCode) {
        if (moment(new Date()).isAfter(moment(userAuth.expiredTimeOfResetPasswordCode))) {// link expire
          return utils.successResponse('Your reset password link is expired on invalid', res);
        }
      } else {
        // invalid token
        return utils.successResponse('Invalid Code', res);
      }
      let response = await authService.resetPassword(userAuth.userId, params.newPassword);
      return utils.successResponse(response.data, res);
    } catch (error) {
      return utils.failureResponse(error.message, res);
    }
  },
  /*
   * api :  authentication
   * description : login user
   */
  login:async (req,res)=>{
    try {
      let {
        username,password
      } = req.body;
      let url = req.originalUrl;
      if (username && password){
        let result = await authService.loginUser(username,password,url); 
        if (!result.flag){
          return utils.loginSuccess(result.data,res);
        }
        return utils.loginFailed(result.data,res);
      } else {
        return utils.insufficientParameters(res);
      }
    } catch (error) {
      return utils.failureResponse(error.message, res);
    }
  }
  ,
  /*
   * api : logout
   * description : Logout User
   */
  logout: async (req, res) => {
    try {
      if (req.user) {
        let userTokens = await dbService.findOne(model.userToken, { token: (req.headers.authorization).replace('Bearer ', '') });
        userTokens.isTokenExpired = true;
        let id = userTokens.id;
        delete userTokens.id;
        await dbService.updateByPk(model.userToken,id, userTokens.toJSON());
        return utils.successResponse('Logged Out Successfully', res);
      }
    } catch (error) {
      return utils.failureResponse(error.message, res);
    }
  }

};
