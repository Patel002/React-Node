import { sequelize } from "../sequelize.js";
import { DataTypes } from "sequelize";

const Settings = sequelize.define('settings',{
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

// Settings.sync({force: true});

export { Settings }