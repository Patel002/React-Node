import { sequelize } from '../sequelize.js';
import { DataTypes } from 'sequelize';
import { Role } from './roles.model.js';
import { Menu } from './menu.model.js';
import { SubMenu } from './subMenu.model.js';    

const Permission = sequelize.define('permission', {
    roleId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Role,
            key: 'id'
        }
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Menu,
        key: 'id'
      }
    },
    subMenuId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: SubMenu,
            key: 'id'
        }
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    write: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    canUpdate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deletePermission: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: true
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: true
    }

},{
    timestamps: true
});


// Permission.sync({alter: true});

export { Permission };