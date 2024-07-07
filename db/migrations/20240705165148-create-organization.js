'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organization', {
      orgId:{
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
         primaryKey: true,
         type: Sequelize.UUID

      },
      name: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      description: {
        type: Sequelize.STRING,
      },
      createdBy:{
        type: Sequelize.UUID,
        references:{
          model: 'user',
          key:'userId', 
        }

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('organization');
  }
};