import React,{ useState, useEffect } from "react";
import axios from "axios";
import '../css/RolePermission.css';
import showToast from '../helper/Toast';

const RolePermission = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(sessionStorage.getItem("selectedRole") || "");
    const [parentFilter, setParentFilter] = useState(sessionStorage.getItem("parentFilter") || "All");
    const [menuPermissions, setMenuPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState({});

    useEffect(() => {
        fetchRoles();
        fetchMenuPermissions();
    }, []);
    
    useEffect(() => {
        if (selectedRole) {
            fetchRolePermissions(selectedRole);
        } else {
            setRolePermissions({});
        }

        const interval = setInterval(() => {
            if (selectedRole) {
                fetchRolePermissions(selectedRole);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [selectedRole]);

    useEffect(() => {
        sessionStorage.setItem("selectedRole", selectedRole);
    }, [selectedRole]);

    useEffect(() => {
        sessionStorage.setItem("parentFilter", parentFilter);
    }, [parentFilter]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://localhost:7171/api/role/list-role");
            setRoles(response.data.roles);
        } catch (error) {
            console.log(error);
            showToast("error", "Failed to fetch roles");
        }
    }

    const fetchRolePermissions = async (roleId) => {
        try {
            const response = await axios.get(`http://localhost:7171/api/permission/list-permission?roleId=${roleId}`);
            const permissionsData = response.data.permissions || {};
            const permissionMap = {};
            
            permissionsData.forEach((perm) => {
                const permissionKey = perm.subMenuId ? `sub_${perm.subMenuId}` : `menu_${perm.menuId}`;
                
                permissionMap[permissionKey] = {
                    read: perm.read,
                    write: perm.write,
                    canUpdate: perm.canUpdate,
                    deletePermission: perm.deletePermission,
                    startTime: perm.startTime || "",
                    endTime: perm.endTime || "",
                    menuId: perm.menuId,
                    subMenuId: perm.subMenuId || null
                };
            });

            setRolePermissions(permissionMap);
        } catch (error) {
            console.error("Error fetching role permissions:", error);
            showToast("error", "Failed to fetch role permissions");
        }
    }

    const fetchMenuPermissions = async () => {
        try {
            const response = await axios.get(`http://localhost:7171/api/permission/all-menu-permissions`);
            const menuData = response.data.data || [];
    
            const structuredMenus = menuData.map(menu => ({
                id: menu.id,
                menuName: menu.menuName,
                parentName: menu.parentName || null,
                subMenus: menu.SubMenus.map(sub => ({
                    ...sub,
                    parentName: menu.menuName
                })) || [],
            }));

            console.log("Menu Permissions:", structuredMenus);

            setMenuPermissions(structuredMenus);
        } catch (error) {
            console.error("Error fetching menu permissions:", error);
            showToast("error", "Failed to fetch menu permissions");
        }
    };
    
    const handlePermissionChange = (key, permissionType) => {
        setRolePermissions((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [permissionType]: !prev[key]?.[permissionType],
            },
        }));
    };

    const handleTimeChange = (key, timeType, value) => {
        setRolePermissions((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [timeType]: value,
            },
        }));
    };

    // const handleSavePermissions = async () => {
    //     if (!selectedRole) {
    //         showToast("error", "Please select a role first");
    //         return;
    //     }

    //     try {
    //         const permissionsToSave = Object.entries(rolePermissions).map(([key, perm]) => ({
    //             roleId: selectedRole,
    //             menuId: perm.menuId,
    //             subMenuId: perm.subMenuId,
    //             read: perm.read || false,
    //             write: perm.write || false,
    //             canUpdate: perm.canUpdate || false,
    //             deletePermission: perm.deletePermission || false,
    //             startTime: perm.startTime || null,
    //             endTime: perm.endTime || null,
    //         }));

    //         await axios.post("http://localhost:7171/api/permission/add-permission", {
    //             permissions: permissionsToSave
    //         });

    //         showToast("success", "Permissions updated successfully!");
    //         window.dispatchEvent(new Event("permissionsUpdated"));
    //     } catch (error) {
    //         console.error("Error saving permissions:", error);
    //         showToast("error", "Failed to update permissions");
    //     }
    // };


    const handleSavePermissions = async () => {
        if (!selectedRole) {
            showToast("error", "Please select a role first");
            return;
        }
    
        try {
            const permissionsToSave = [];
            
            menuPermissions.forEach(menu => {
                const menuKey = `menu_${menu.id}`;
                if (rolePermissions[menuKey]) {
                    permissionsToSave.push({
                        roleId: selectedRole,
                        menuId: menu.id,
                        subMenuId: null,
                        read: rolePermissions[menuKey].read || false,
                        write: rolePermissions[menuKey].write || false,
                        canUpdate: rolePermissions[menuKey].canUpdate || false,
                        deletePermission: rolePermissions[menuKey].deletePermission || false,
                        startTime: rolePermissions[menuKey].startTime || null,
                        endTime: rolePermissions[menuKey].endTime || null
                    });
                }

                menu.subMenus.forEach(subMenu => {
                    const subKey = `sub_${subMenu.id}`;
                    if (rolePermissions[subKey]) {
                        permissionsToSave.push({
                            roleId: selectedRole,
                            menuId: menu.id,
                            subMenuId: subMenu.id,
                            read: rolePermissions[subKey].read || false,
                            write: rolePermissions[subKey].write || false,
                            canUpdate: rolePermissions[subKey].canUpdate || false,
                            deletePermission: rolePermissions[subKey].deletePermission || false,
                            startTime: rolePermissions[subKey].startTime || null,
                            endTime: rolePermissions[subKey].endTime || null
                        });
                    }
                });
            });
    
            console.log("Saving permissions:", permissionsToSave);

            const results = await Promise.allSettled(
                permissionsToSave.map(perm => 
                    axios.post("http://localhost:7171/api/permission/add-permission", perm)
                )
            );
    
            const failedSaves = results.filter(r => r.status === 'rejected');
            if (failedSaves.length > 0) {
                console.error("Failed to save some permissions:", failedSaves);
                throw new Error(`${failedSaves.length} permissions failed to save`);
            }
    
            showToast("success", "Permissions updated successfully!");
            window.dispatchEvent(new Event("permissionsUpdated"));
        } catch (error) {
            console.error("Error saving permissions:", error);
            showToast("error", error.message || "Failed to update permissions");
        }
    };


    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        setSelectedRole(roleId);
    };

    const getPermissionKey = (item, isSubmenu = false) => {
        return isSubmenu ? `sub_${item.id}` : `menu_${item.id}`;
    };

    const getParentFilterOptions = () => {
        const parents = new Set(["All"]);
        
        menuPermissions.forEach(menu => {
            if (menu.parentName) {
                parents.add(menu.parentName);
            } else {
                parents.add(menu.menuName);
            }
            
            menu.subMenus.forEach(sub => {
                if (sub.parentName) {
                    parents.add(sub.parentName);
                }
            });
        });
        
        return Array.from(parents);
    };

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>User Roles</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard"><i className="fa-solid fa-house"/></a></li>
                                <li className="breadcrumb-item active">Role Permission</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header bg-white text-black">
                                    <h3>Role List</h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>User Role*</label>
                                            <select 
                                                className="form-control" 
                                                value={selectedRole} 
                                                onChange={handleRoleChange} 
                                                required
                                            >
                                                <option value="">Select</option>
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.roleName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label>Parent Name</label>
                                            <select 
                                                className="form-control" 
                                                value={parentFilter} 
                                                onChange={(e) => setParentFilter(e.target.value)}
                                            >
                                                {getParentFilterOptions().map((parent, index) => (
                                                    <option key={index} value={parent}>
                                                        {parent}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                           
            <div className="row mt-4">
            <div className="col-md-12">
            <table className="table table-white table-bordered">
            <thead>
                        <tr>
                        <th>Parent Name</th>
                        <th>Menu</th>
                        <th>Read</th>
                        <th>Write</th>
                        <th>Update</th>
                        <th>Delete</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        </tr>
            </thead>
            <tbody>
            {menuPermissions
            .filter((menu) => {
            if (parentFilter === "All") return true;
            if (menu.menuName === parentFilter) return true;
            return menu.parentName === parentFilter;
            })
            .sort((a, b) => {
            if (!a.parentName && b.parentName) return -1;
            if (a.parentName && !b.parentName) return 1;
            return (a.menuName || "").localeCompare(b.menuName || "");
            })
            .map((menu) => {
            const menuKey = getPermissionKey(menu);
            const menuPerms = rolePermissions[menuKey] || {};

            return (
            <React.Fragment key={menu.id}>
                <tr className="parent-menu">
                <td>{menu.parentName || ""}</td>
                <td>{menu.menuName}</td>
                <td>
                    <input 
                    type="checkbox" 
                    checked={menuPerms.read || false} 
                    onChange={() => handlePermissionChange(menuKey, "read")} 
                    />
  </td>
        <td>
        <input 
        type="checkbox" 
        checked={menuPerms.write || false} 
        onChange={() => handlePermissionChange(menuKey, "write")} 
            />
        </td>
        <td>
        <input 
        type="checkbox" 
        checked={menuPerms.canUpdate || false} 
        onChange={() => handlePermissionChange(menuKey, "canUpdate")} 
    />
    </td>
    <td>
        <input 
            type="checkbox" 
            checked={menuPerms.deletePermission || false} 
            onChange={() => handlePermissionChange(menuKey, "deletePermission")} 
        />
    </td>
    <td>
        <input 
            type="time" 
            className="form-control" 
            value={menuPerms.startTime || ""} 
            onChange={(e) => handleTimeChange(menuKey, "startTime", e.target.value)} 
        />
    </td>
    <td>
        <input 
            type="time" 
            className="form-control" 
            value={menuPerms.endTime || ""} 
            onChange={(e) => handleTimeChange(menuKey, "endTime", e.target.value)} 
        />
    </td>
</tr>
            
{menu.subMenus.map((subMenu) => {
    const subKey = getPermissionKey(subMenu, true);
    const subPerms = rolePermissions[subKey] || {};
    
            return (
                <tr key={subMenu.id} className="submenu">
                    <td>{subMenu.parentName || menu.menuName}</td>
                    <td>{subMenu.menuName}</td>
                    <td>
                        <input 
                            type="checkbox" 
                            checked={subPerms.read || false} 
                            onChange={() => handlePermissionChange(subKey, "read")} 
                        />
                    </td>
                    <td>
                        <input 
                            type="checkbox" 
                            checked={subPerms.write || false} 
                            onChange={() => handlePermissionChange(subKey, "write")} 
                        />
                    </td>
                    <td>
                        <input 
                            type="checkbox" 
                            checked={subPerms.canUpdate || false} 
                            onChange={() => handlePermissionChange(subKey, "canUpdate")} 
                        />
                    </td>
                    <td>
                        <input 
                            type="checkbox" 
                            checked={subPerms.deletePermission || false} 
                            onChange={() => handlePermissionChange(subKey, "deletePermission")} 
                        />
                    </td>
                    <td>
                        <input 
                            type="time" 
                            className="form-control" 
                            value={subPerms.startTime || ""} 
                            onChange={(e) => handleTimeChange(subKey, "startTime", e.target.value)} 
                        />
                    </td>
                    <td>
                        <input 
                            type="time" 
                            className="form-control" 
                            value={subPerms.endTime || ""} 
                            onChange={(e) => handleTimeChange(subKey, "endTime", e.target.value)} 
                        />
                    </td>
                </tr>
            );
        })}
    </React.Fragment>
);
})}
        </tbody>
    </table>
            </div>
        </div>
        <div className="text-right mt-3">
            <button 
                className="btn btn-primary" 
                onClick={handleSavePermissions}
                disabled={!selectedRole}
            >
                <i className="fa fa-check mr-2"></i>
                Set Permissions
             </button>
            </div>
           </div>
          </div>
         </div>
        </div>
      </div>
    </section>
   </div>
);
};

export default RolePermission;