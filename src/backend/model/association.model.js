import { Menu } from "./menu.model.js";
import { Role } from "./roles.model.js";
import { Permission } from "./permission.model.js";

Menu.hasMany(Menu, { 
    foreignKey: 'parent', 
    sourceKey: 'menuName', 
    as: 'SubMenus'    
});

Menu.belongsTo(Menu, { 
    foreignKey: 'parent', 
    targetKey: 'menuName',  
    as: 'ParentMenu'  
});

Menu.hasMany(Permission, { as: "Permissions", foreignKey: "menuId" });
Permission.belongsTo(Menu,{as:"Menu",foreignKey:'menuId'})
Permission.belongsTo(Role,{as:"Role",foreignKey:'roleId'})

const apply = () => {
    console.log("Association has been applied");
}

export { apply };