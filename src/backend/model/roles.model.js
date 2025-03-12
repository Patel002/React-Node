import { sequelize } from "../sequelize.js";
import { DataTypes } from "sequelize";

const Role = sequelize.define('role',{
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
   },{
    timestamps: true
   })

//    Role.sync({alter: true});

export { Role };