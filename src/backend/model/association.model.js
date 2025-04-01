import { User } from "./user.model.js";
import { Menu } from "./menu.model.js";
import { Role } from "./roles.model.js";
import { SubMenu } from "./subMenu.model.js";
import { Permission } from "./permission.model.js";

User.belongsTo(Role, {as: "userRole",targetKey:"roleName",foreignKey: "role"});

Role.hasMany(User, {foreignKey: "role"});

Menu.hasMany(SubMenu , {as: "SubMenus", foreignKey: "mainMenu", sourceKey: "menuName" });
SubMenu.belongsTo(Menu, {as: "MainMenu", foreignKey: "mainMenu", targetKey: "menuName"});

Menu.belongsTo(Menu, { 
    foreignKey: 'parent', 
    targetKey: 'menuName',
    as: 'ParentMenu'  
});

Menu.hasMany(Permission, { as: "Permissions", foreignKey: "menuId" });
SubMenu.hasMany(Permission, { as: "Permissions" , foreignKey: 'subMenuId'});

Permission.belongsTo(Menu,{as:"Menu",foreignKey:'menuId'})
Permission.belongsTo(Role,{as:"Role",foreignKey:'roleId'})
Permission.belongsTo(SubMenu,{as:"SubMenu",foreignKey:'subMenuId'})

const apply = () => {
    console.log("Association has been applied");
}

export { apply };