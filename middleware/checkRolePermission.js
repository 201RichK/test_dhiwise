const { Op } = require('sequelize');
const model = require('../model');
const dbService = require('../utils/dbService');
const util = require('../utils/messages');
const { replaceAll } = require('../utils/common');
const { role } = require('../model');

const checkRolePermission = async (req, res, next) => {
  if (req.user) {
    const loggedInUserId = req.user.id;
    let rolesOfUser = await dbService.findMany(model.userRole, {

      userId: loggedInUserId,
      isActive: true,
      isDeleted: false,

    },
    { attributes: ['roleId'] });
    if (rolesOfUser && rolesOfUser.data && rolesOfUser.data.length) {
      rolesOfUser = [...new Set((rolesOfUser.data).map((item) => item.roleId))];
      const route = await dbService.findOne(model.projectRoute, {
        route_name: replaceAll((req.route.path.toLowerCase()).substring(1), '/', '_'),
        uri: req.route.path.toLowerCase(),
      });
      if (route) {
        const allowedRoute = await dbService.findMany(model.routeRole, {

          [Op.and]: [
            { routeId: route.id },
            { roleId: { [Op.in]: rolesOfUser } },
            { isActive: true },
            { isDeleted: false },
          ],

        });
        if (allowedRoute && allowedRoute.data.length) {
          next();
        } else {
          return util.unAuthorizedRequest('You are not having permission to access this route!', res);
        }
      } else {
        next();
      }
    } else {
      // return util.unAuthorizedRequest('You are not having permission to access this route!', res);
      next();
    }
  } else {
    return util.unAuthorizedRequest('Authorization token required!', res);
  }
  return undefined;
};

module.exports = checkRolePermission;
