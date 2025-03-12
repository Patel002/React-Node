import { sequelize } from '../sequelize.js';
import { DataTypes } from 'sequelize';

const SubMenu = sequelize.define('submenu',{
    mainMenu:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    subMenuName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
        allowNull: false
    }
})

// SubMenu.sync({alter: true});

export { SubMenu };