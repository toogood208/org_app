module.exports = function(models) {
    models.User.belongsToMany(models.Organization, {
      through: 'userOrganization',
      foreignKey: 'userId',
      otherKey: 'orgId'
    });
  
    models.Organization.belongsToMany(models.User, {
      through: 'userOrganization',
      foreignKey: 'orgId',
      otherKey: 'userId'
    });
  
    models.Organization.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'Creator'
    });
  };