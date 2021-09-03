const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/userController');
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/user/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),checkRolePermission,userController.addUser);
router.route('/admin/user/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),checkRolePermission,userController.findAllUser);
router.route('/admin/user/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),checkRolePermission,userController.getUser);
router.route('/admin/user/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),checkRolePermission,userController.getUserCount);
router.route('/admin/user/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),checkRolePermission,userController.updateUser);    
router.route('/admin/user/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),checkRolePermission,userController.partialUpdateUser);
router.route('/admin/user/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),checkRolePermission,userController.softDeleteUser);
router.route('/admin/user/softDeleteMany').put(auth(...[ 'softDeleteManyByAdminInAdminPlatform' ]),checkRolePermission,userController.softDeleteManyUser);
router.route('/admin/user/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),checkRolePermission,userController.bulkInsertUser);
router.route('/admin/user/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),checkRolePermission,userController.bulkUpdateUser);
router.route('/admin/user/change-password').put(auth(...[ 'changePasswordByAdminInAdminPlatform' ]),userController.changePassword);
router.route('/admin/user/update-profile').put(auth(...[ 'updateProfileByAdminInAdminPlatform' ]),userController.updateProfile);

module.exports = router;
