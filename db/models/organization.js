'use strict';
import { Sequelize } from "sequelize";
import sequelize from "../../config/database.js";

const Organization =  sequelize.define('organization', {
  orgId: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
     primaryKey: true,
     type: Sequelize.UUID
  },
  name: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: 'name cannot be null'
      },
      notEmpty: {
          msg: "name cannot be empty",
        },
    }
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
},
{
  paranoid:true,
  freezeTableName: true,
  modelName: 'organization'

});




export default Organization;