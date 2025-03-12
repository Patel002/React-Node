import { Permission } from "../model/permission.model.js";
import { Role } from "../model/roles.model.js";
import { Menu } from "../model/menu.model.js";
// import { Op } from "sequelize";

const addPermission = async (req, res) => {
    try {
        const {roleId,menuId,read, write, update, deletePermission,startTime,endTime} = req.body;

        const roleExists = await Role.findByPk(roleId);
        const menuExists = await Menu.findByPk(menuId);

        if (!roleExists || !menuExists) {
            return res.status(404).json({
                success: false,
                message: "Role or Menu not found"
            });
        }

        let permission = await Permission.findOne({
            where: { roleId, menuId }
        });

        if(permission) {
            await permission.update({
                read: read || false,
                write: write || false,
                update: update || false,
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
        permission =await Permission.create({
            roleId,
            menuId,
            read: read || false,
            write: write || false,
            update: update || false,
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
        return res.status(500).json({
            message: "Error while adding permission",
            error
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
            where: whereCondition
        });
        return res.status(200).json({message: "Permission list fetched successfully",
            permissions
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while getting permission list", error: error.message});
    }
}

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
                    attributes: ["roleId","read", "write", "update", "deletePermission"],
                    include: [
                        {
                            model: Role,
                            as: "Role",
                            attributes: ["roleName"]
                        }
                    ]
                }
            ],
            attributes: ["id", "menuName", "parent", "url", "icon", "active", "sequence"]
        });

        const formattedMenu = menuPermissions.map(menu => ({
            id: menu.id,
            menuName: menu.menuName,
            parentName: menu.ParentMenu ? menu.ParentMenu.menuName : null,
            url: menu.url,
            icon: menu.icon,
            active: menu.active,
            sequence: menu.sequence,
            permissions: menu.Permissions.map(permission => ({
                roleId: permission.roleId,
                roleName: permission.Role ? permission.Role.roleName : null, 
                read: permission.read,
                write: permission.write,
                update: permission.update,
                deletePermission: permission.deletePermission
            }))
        }));

        return res.status(200).json({
            success: true,
            data: formattedMenu
        });
        
    } catch (error) {
        console.log("Error while menu and there respective permissions",error);
        return res.status(500).json({message: "Error while getting permission list with menu", error: error.message});
    }
}

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
                    attributes: ["id", "menuName", "parent"]
                }
            ],
            raw: true 
        });

        const permittedMenus = permissions.map(p => ({
            id: p["menu.id"],
            name: p["menu.menuName"],
            parent: p["menu.parent"]
        }));

         console.log(permittedMenus)

        return res.status(200).json({
            success: true,
            message: "Permission list fetched successfully",
            data: permittedMenus
        });
    } catch (error) {
        console.log(error);
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