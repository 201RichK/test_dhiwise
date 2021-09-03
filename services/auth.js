const model = require('../model/index');
const dbService = require('../utils/dbService');
const {
  JWT,LOGIN_ACCESS,
  PLATFORM,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME,FORGOT_PASSWORD_WITH
} = require('../constants/authConstant');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const moment = require('moment');
const bcrypt = require('bcrypt');
const emailService = require('./email/emailService');
const sendSMS = require('./sms/smsService');
const { Op } = require('sequelize');
const uuid = require('uuid').v4;

async function generateToken (user,secret){
  return jwt.sign( {
    id:user.id,
    'email':user.email
  }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
}
async function sendEmailForResetPasswordLink (user) {
  try {
    let token = uuid();
    let expires = moment();
    expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, 'minutes').toISOString();
    await dbService.updateMany(model.userAuthSettings, { userId:user.id },
      {
        resetPasswordCode: token,
        expiredTimeOfResetPasswordCode: expires
      });
    let viewType = '/reset-password/';
    let msg = 'Click on the link below to reset your password.';
    let mailObj = {
      subject: 'Reset Password',
      to: user.email,
      template: '/views/resetPassword',
      data: {
        link: `http://localhost:${process.env.PORT}` + viewType + token,
        linkText: 'Reset Password',
        message:msg
      }
    };
    await emailService.sendEmail(mailObj);
    return true;
  } catch (e) {
    return false;
  }
}
async function sendSMSForResetPasswordLink (user) {
  try {
    let token = uuid();
    let expires = moment();
    expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, 'minutes').toISOString();
    await dbService.updateMany(model.userAuthSettings, { userId:user.id },
      {
        resetPasswordCode: token,
        expiredTimeOfResetPasswordCode: expires
      });
    let viewType = '/reset-password/';
    let msg = `Click on the link to reset your password.
        http://localhost:${process.env.PORT}${viewType + token}`;
    let smsObj = {
      to:user.mobileNo,
      message:msg
    };
    await sendSMS(smsObj);
    return true;
  } catch (error) {
    return false;
  }
}
let auth =  module.exports = {};
auth.loginUser = async (username,password,url) => {
  try {
    let where = { 'email':username };
    const user = await dbService.findOne(model.user,where);
    if (user) {
      const userAuth = await dbService.findOne(model.userAuthSettings, { userId: user.id });
      if (userAuth && userAuth.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT) {
        if (userAuth.loginReactiveTime) {
          let now = moment();
          let limitTime = moment(userAuth.loginReactiveTime);
          if (limitTime > now) {
            let expireTime = moment().add(LOGIN_REACTIVE_TIME, 'minutes').toISOString();
            await dbService.updateMany(model.userAuthSettings, { userId:user.id }, {
              loginReactiveTime: expireTime,
              loginRetryLimit: userAuth.loginRetryLimit + 1
            });
            return {
              flag: true,
              data: `you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
            };
          }
        } else {
          // send error
          let expireTime = moment().add(LOGIN_REACTIVE_TIME, 'minutes').toISOString();
          await dbService.updateMany(model.userAuthSettings, { userId:user.id }, {
            loginReactiveTime: expireTime,
            loginRetryLimit: userAuth.loginRetryLimit + 1
          });
          return {
            flag: true,
            data: `you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
          };
        }
      }
      const isPasswordMatched = await user.isPasswordMatch(password);
      if (isPasswordMatched) {
        const {
          password,...userData
        } = user.toJSON();
        let token;
        if (!user.role){
          return {
            flag:true,
            data:'You have no assigned any role'
          };
        }
        if (url.includes('admin')){
          if (!LOGIN_ACCESS[user.role].includes(PLATFORM.ADMIN)){
            return {
              flag:true,
              data:'you are unable to access this platform'
            };
          }
          token = await generateToken(userData,JWT.ADMIN_SECRET);
        }
        else if (url.includes('client')){
          if (!LOGIN_ACCESS[user.role].includes(PLATFORM.CLIENT)){
            return {
              flag:true,
              data:'you are unable to access this platform'
            };
          }
          token = await generateToken(userData,JWT.CLIENT_SECRET);
        }
        if (userAuth && userAuth.loginRetryLimit){
          await dbService.updateMany(model.userAuthSettings, { userId:user.id }, {
            loginRetryLimit: 0,
            loginReactiveTime: null
          });
        }
        let expire = moment().add(JWT.EXPIRES_IN, 'seconds').toISOString();
        await dbService.createOne(model.userToken, {
          userId: user.id,
          token: token,
          tokenExpiredTime: expire 
        });
        const userToReturn = {
          ...userData,
          ...{ token } 
        };
        return {
          flag:false,
          data:userToReturn
        };
      } else {
        await dbService.updateMany(model.userAuthSettings,{ userId:user.id },{ loginRetryLimit:userAuth.loginRetryLimit + 1 });
        return {
          flag:true,
          data:'Incorrect Password'
        };
      }
    } else {
      return {
        flag:true,
        data:'User not exists'
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
},
auth.changePassword = async (params)=>{
  try {
    let password = params.newPassword;
    let oldPassword = params.oldPassword;
    let where = { id:params.userId };
    let user = await dbService.findOne(model.user,where);
    if (user && user.id) {
      const isPasswordMatched = await user.isPasswordMatch(oldPassword);
      if (!isPasswordMatched){
        return {
          flag:true,
          data:'Incorrect Old Password'
        };
      }
      password = await bcrypt.hash(password, 8);
      let updatedUser = dbService.updateByPk(model.user,user.id,{ password:password });
      if (updatedUser) {
        return {
          flag:false,
          data:'Password changed successfully'
        };                
      }
      return {
        flag:true,
        data:'password can not changed due to some error.please try again'
      };
    }
    return {
      flag:true,
      data:'User not found'
    };
  } catch (error) {
    throw new Error(error.message);
  }
},
auth.sendResetPasswordNotification = async (user) => {
  let resultOfEmail = false;
  let resultOfSMS = false;
  try {
    if (FORGOT_PASSWORD_WITH.LINK.email){
      resultOfEmail = await sendEmailForResetPasswordLink(user);
    }
    if (FORGOT_PASSWORD_WITH.LINK.sms){
      resultOfSMS = await sendSMSForResetPasswordLink(user);
    }
    return {
      resultOfEmail,
      resultOfSMS
    };
  } catch (error) {
    throw new Error(error.message);
  }
},
auth.resetPassword = async (userId, newPassword) => {
  try {
    let where = { id: userId };
    const dbUser = await dbService.findOne(model.user,where);
    if (!dbUser) {
      return {
        flag: false,
        data: 'User not found',
      };
    }
    newPassword = await bcrypt.hash(newPassword, 8);
    let updatedUser = await dbService.updateByPk(model.user, userId, { password: newPassword });
    if (!updatedUser) {
      return {
        flag: true,
        data: 'Password is not reset successfully',
      };
    }
    await dbService.updateMany(model.userAuthSettings, { userId:userId }, {
      resetPasswordCode: '',
      expiredTimeOfResetPasswordCode: null,
      loginRetryLimit: 0 
    });
    let mailObj = {
      subject: 'Reset Password',
      to: dbUser.email,
      template: '/views/successfullyResetPassword',
      data: {
        isWidth: true,
        email: dbUser.email || '-',
        message: 'Password Successfully Reset'
      }
    };
    await emailService.sendEmail(mailObj);
    return {
      flag: false,
      data: 'Password reset successfully',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};