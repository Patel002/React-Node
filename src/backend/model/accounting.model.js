import { sequelize } from "../sequelize.js";
import { DataTypes } from "sequelize";

const Accounting = sequelize.define('accounting', {
    glCodeId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Accounting.sync({alter: true});

export { Accounting };