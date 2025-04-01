import { sequelize } from "../sequelize.js";    
import { DataTypes } from "sequelize";

const Menu = sequelize.define('menu', {
    menuName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
        allowNull: false
    },
    sequence: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 0
    }
})

// Menu.sync({alter: true});

export { Menu };