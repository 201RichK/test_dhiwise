const dbConnection = require('../config/dbConnection');
const db = {};
db.sequelize = dbConnection;

db.user = require('./user');
db.userAuthSettings = require('./userAuthSettings');
db.userToken = require('./userToken');
db.role = require('./role');
db.projectRoute = require('./projectRoute');
db.routeRole = require('./routeRole');
db.userRole = require('./userRole');

db.user.belongsTo(db.user, { foreignKey: 'addedBy' });
db.user.belongsTo(db.user, { foreignKey: 'updatedBy' });
db.userAuthSettings.belongsTo(db.user, { foreignKey: 'userId' });
db.userToken.belongsTo(db.user, { foreignKey: 'userId' });
db.userRole.belongsTo(db.user, { foreignKey: 'userId' });
db.routeRole.belongsTo(db.role, { foreignKey: '' });
db.userRole.belongsTo(db.role, { foreignKey: 'roleId' });
db.routeRole.belongsTo(db.projectRoute, { foreignKey: 'routeId' });

module.exports = db;