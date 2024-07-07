'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userorganization', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'userId',
        },
      },
      orgId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organization',
          key: 'orgId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userorganization');
  },
};
