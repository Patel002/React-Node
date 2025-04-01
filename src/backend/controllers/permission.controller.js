import { Permission } from "../model/permission.model.js";
import { Role } from "../model/roles.model.js";
import { Menu } from "../model/menu.model.js";
import { SubMenu } from "../model/subMenu.model.js";

const addPermission = async (req, res) => {
    try {
        const {roleId,menuId,subMenuId,read, write, canUpdate, deletePermission,startTime,endTime} = req.body;

        const subMenuIdValue = subMenuId !== undefined ? subMenuId : null;

        const roleExists = await Role.findByPk(roleId);
        if (!roleExists) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }

        let menuExists = null;
        let subMenuExists = null;

        if (subMenuIdValue) {
            subMenuExists = await SubMenu.findByPk(subMenuIdValue);
            if (!subMenuExists) {
                return res.status(404).json({ success: false, message: "SubMenu not found" });
            }
            menuExists = await Menu.findOne({ where: { menuName: subMenuExists.mainMenu } });
           
            if (!menuExists) {
                return res.status(404).json({ success: false, message: "Parent Menu not found for this SubMenu" });
            }
        } else {
            menuExists = await Menu.findByPk(menuId);
        }

        if (!menuExists) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }
 
        if (subMenuId && !subMenuExists) {
            return res.status(404).json({ success: false, message: "SubMenu not found" });

        }

        let permission = await Permission.findOne({
            where: {
                roleId,
                menuId: menuExists.id,
                subMenuId: subMenuIdValue
            },
        });

        if(permission) {
            await permission.update({
                read: read || false,
                write: write || false,
                canUpdate: canUpdate || false,
                deletePermission: deletePermission || false,
                startTime: startTime || null,
                endTime: endTime || null
            })

            return res.status(200).json({
                success: true,
                message: "Permission updated successfully",
                permission
            })
        }
        permission = await Permission.create({
            roleId,
            menuId: menuExists.id,
            subMenuId: subMenuIdValue,
            read: read || false,
            write: write || false,
            canUpdate: canUpdate || false,
            deletePermission: deletePermission || false,
            startTime: startTime || null,
            endTime: endTime || null
        })

        return res.status(201).json({
            success:true,   
            message: "Permission added successfully",
            permission
        })
        
    } catch (error) {
        console.log("Error while adding permission", error);
        return res.status(500).json({
            message: "Error while adding permission",
            error: error.message || error
        })
    }
}

const getPermissionList = async (req, res) => {
    const { roleId } = req.query;
    try {
        if (!roleId) {
            return res.status(400).json({ success: false, message: "Role ID is required" });
        }

        let whereCondition = { roleId }; 

        const permissions = await Permission.findAll({
            where: whereCondition,
            include:[
                { model: Menu, as: "Menu", attributes: ["id", "menuName","parent"] },

                { model: SubMenu, as: "SubMenu", attributes: ["id", "subMenuName","mainMenu"] }
            ]
        });
        return res.status(200).json({message: "Permission list fetched successfully",
            permissions
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while getting permission list", error: error.message});
    }
}

// const getAllMenuPermissions = async (req, res) => {
//     try {
//         const menuPermissions = await Menu.findAll({
//             include: [
//                 {
//                     model: Menu,
//                     as: "ParentMenu",
//                     attributes: ["menuName","id"]
//                 },
//                 {
//                     model: Permission,
//                     as: "Permissions",
//                     attributes: ["roleId","read", "write", "canUpdate", "deletePermission"],
//                     include: [
//                         {
//                             model: Role,
//                             as: "Role",
//                             attributes: ["roleName"]
//                         }
//                     ]
//                 }
//             ],
//             attributes: ["id", "menuName", "parent", "url", "icon", "active", "sequence"]
//         });

//         const formattedMenu = menuPermissions.map(menu => ({
//             id: menu.id,
//             menuName: menu.menuName,
//             parentName: menu.ParentMenu ? menu.ParentMenu.menuName : null,
//             url: menu.url,
//             icon: menu.icon,
//             active: menu.active,
//             sequence: menu.sequence,
//             permissions: menu.Permissions.map(permission => ({
//                 roleId: permission.roleId,
//                 roleName: permission.Role ? permission.Role.roleName : null, 
//                 read: permission.read,
//                 write: permission.write,
//                 canUpdate: permission.canUpdate,
//                 deletePermission: permission.deletePermission
//             }))
//         }));

//         return res.status(200).json({
//             success: true,
//             data: formattedMenu
//         });
        
//     } catch (error) {
//         console.log("Error while menu and there respective permissions",error);
//         return res.status(500).json({message: "Error while getting permission list with menu", error: error.message});
//     }
// }

const getAllMenuPermissions = async (req, res) => {
    try {
        const menuPermissions = await Menu.findAll({
            include: [
                {
                    model: Menu,
                    as: "ParentMenu",
                    attributes: ["menuName","id"]
                },
                {
                    model: Permission,
                    as: "Permissions",
                    attributes: ["roleId", "read", "write", "canUpdate", "deletePermission"],
                    include: [
                        { 
                            model: Role, 
                            as: "Role", 
                            attributes: ["roleName","id"] 
                        }
                    ]
                },
                {
                    model: SubMenu,
                    as: "SubMenus",
                    attributes: ["subMenuName","id","mainMenu"],
                    include: [
                        {
                            model: Permission,
                            as: "Permissions",
                            attributes: ["roleId", "read", "write", "canUpdate", "deletePermission"],
                            include: [
                                { 
                                    model: Role, 
                                    as: "Role", 
                                    attributes: ["roleName","id"] 
                                }
                            ]
                        }
                    ]
                }
            ],
            attributes: ["id", "menuName","parent", "url", "icon", "active"]
        });


        const formattedMenu = menuPermissions.map(menu => ({
            id: menu.id,
            menuName: menu.menuName,
            parentName: menu.ParentMenu ? menu.ParentMenu.menuName : null,  
            url: menu.url,
            icon: menu.icon,
            active: menu.active,
            permissions: (menu.Permissions || []).map(permission => ({
                roleId: permission.roleId,
                roleName: permission.Role ? permission.Role.roleName : null,
                read: permission.read,
                write: permission.write,
                canUpdate: permission.canUpdate,
                deletePermission: permission.deletePermission
            })),
            SubMenus: (menu.SubMenus || []).map(subMenu => ({
                id: subMenu.id,
                menuId: menu.id,
                menuName: subMenu.subMenuName,
                parentName: subMenu.mainMenu,
                permissions: (subMenu.Permissions || []).map(permission => ({
                    roleId: permission.roleId,
                    roleName: permission.Role ? permission.Role.roleName : null,
                    read: permission.read,
                    write: permission.write,
                    canUpdate: permission.canUpdate,
                    deletePermission: permission.deletePermission
                }))
            }))
        }));

        return res.status(200).json({ success: true, data: formattedMenu });

    } catch (error) {
        console.log("Error while fetching menu permissions:", error);
        return res.status(500).json({ message: "Error while getting permission list with menu", error: error.message });
    }
};

// const getSidebarMenuByRole = async (req, res) => {
//     const { roleId } = req.query;
//     try {
//         if (!roleId) {
//             return res.status(400).json({ success: false, message: "Role ID is required" });
//         }

//         const permissions = await Permission.findAll({
//             where: { roleId },
//             include: [
//                 {
//                     model: Menu,
//                     as: "Menu", 
//                     attributes: ["id", "menuName", "parent","url", "icon"],
//                     include: [
//                         {
//                         model: SubMenu,
//                         as: "SubMenus",
//                         attributes: ["id", "subMenuName","mainMenu","url"]
//                         }
//                     ]
//                 }
//             ]
//         });

//             if (!permissions.length) {
//             return res.status(404).json({ success: false, message: "No menu permissions found for this role." });
//         }

//         const permittedMenus = permissions.map(p => {
//             if (!p.Menu) {
//                 console.error("Menu data is missing for permission:", p);
//                 return null;
//             }
//             return {
//                 id: p.Menu.id,
//                 menuName: p.Menu.menuName,
//                 parent: p.Menu.parent,
//                 url: p.Menu.url,
//                 icon: p.Menu.icon,
//                 subMenus: p.Menu.SubMenus.map(subMenu => ({
//                     id: subMenu.id,
//                     menuName: subMenu.subMenuName,
//                     parent: subMenu.mainMenu,
//                     url: subMenu.url
//                 }))
//             };
//         }).filter(Boolean); 
           
//          console.log(permittedMenus)

//         return res.status(200).json({
//             success: true,
//             message: "Permission list fetched successfully",
//             data: permittedMenus
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error while getting permission list",
//             error: error.message
//         });
//     }
// };

const getSidebarMenuByRole = async (req, res) => {
    const { roleId } = req.query;
    try {
        if (!roleId) {
            return res.status(400).json({ success: false, message: "Role ID is required" });
        }
        
        const permissions = await Permission.findAll({
            where: { roleId },
            include: [
                {
                    model: Menu,
                    as: "Menu",
                    attributes: ["id", "menuName", "parent", "url", "icon"],
                    required: false
                },
                {
                    model: SubMenu,
                    as: "SubMenu",
                    attributes: ["id", "subMenuName", "mainMenu", "url"],
                    required: false
                }
            ],
            raw: true 
        });

        if (!permissions.length) {
            return res.status(404).json({ success: false, message: "No permissions found for this role." });
        }

        const menuMap = new Map();
        const subMenuMap = new Map();

        permissions.forEach(perm => {
            if (perm.menuId && !perm.subMenuId && perm['Menu.id']) {
                menuMap.set(perm['Menu.id'], {
                    id: perm['Menu.id'],
                    menuName: perm['Menu.menuName'],
                    parent: perm['Menu.parent'],
                    url: perm['Menu.url'],
                    icon: perm['Menu.icon'],
                    subMenus: []
                });
            }
            
            if (perm.subMenuId && perm['SubMenu.id']) {
                subMenuMap.set(perm['SubMenu.id'], {
                    id: perm['SubMenu.id'],
                    menuName: perm['SubMenu.subMenuName'],
                    parent: perm['SubMenu.mainMenu'],
                    url: perm['SubMenu.url'],
                    icon: null
                });
            }
        });

        subMenuMap.forEach(subMenu => {
            if (menuMap.has(subMenu.parent)) {
                menuMap.get(subMenu.parent).subMenus.push(subMenu);
            } else {
                menuMap.set(subMenu.id, {
                    ...subMenu,
                    subMenus: []
                });
            }
        });

        const menuTree = Array.from(menuMap.values());

        return res.status(200).json({
            success: true,
            message: "Permission list fetched successfully",
            data: menuTree
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while getting permission list",
            error: error.message
        });
    }
};


export{
    addPermission,
    getPermissionList,
    getAllMenuPermissions,
    getSidebarMenuByRole
}