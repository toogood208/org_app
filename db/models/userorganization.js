"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

export default sequelize.define(
  "userorganization",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    orgId: {
      type: DataTypes.UUID,
      references: {
        model: "organization",
        key: "orgId",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "user",
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "userorganization",
    freezeTableName: true,
  }
);
