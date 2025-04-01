import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/RolePermission.css';
import showToast from '../helper/Toast';

const RolePermission = () => {

    // const navigate = useNavigate();

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
           console.log("this is comes from fetch roles in role permission",response.data.roles);
        } catch (error) {
        console.log(error);
        }
    }

    const fetchRolePermissions = async (roleId) => {
        console.log("Fetching permissions for roleId:", roleId);

        try {
            const response = await axios.get(`http://localhost:7171/api/permission/list-permission?roleId=${roleId}`);
            const permissionsData = response.data.permissions || {};
            const permissionMap = {};
            permissionsData.forEach((perm) => {
                   if (!perm.subMenuId) {
                permissionMap[perm.menuId] = {
                    read: perm.read,
                    write: perm.write,
                    canUpdate: perm.canUpdate,
                    deletePermission: perm.deletePermission,
                    startTime: perm.startTime || "",
                    endTime: perm.endTime || "",
                }
            }
            else {
                permissionMap[perm.subMenuId] = {
                    read: perm.read,
                    write: perm.write,
                    canUpdate: perm.canUpdate,
                    deletePermission: perm.deletePermission,
                    startTime: perm.startTime || "",
                    endTime: perm.endTime || "",
                };
            }
        });

            setRolePermissions(permissionMap);
            console.log('this is comes from fetch role permission',permissionMap);
        } catch (error) {
            console.error("Error fetching role permissions:", error);
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
                permissions: menu.permissions || [],
                subMenus: menu.SubMenus, 
            }));

            console.log("Structured Menus:", structuredMenus);
    
            setMenuPermissions(structuredMenus);
            console.log("Fetched Menu Permissions:", structuredMenus);
        } catch (error) {
            console.error("Error fetching menu permissions:", error);
        }
    };
    
    const handlePermissionChange = (menuId, permissionType) => {
        setRolePermissions((prev) => ({
            ...prev,
            [menuId]: {
                ...prev[menuId],
                [permissionType]: !prev[menuId]?.[permissionType],
            },
        }));
    };

    const handleSavePermissions = async () => {
        try {
            const permissionsArray = [];
            
            menuPermissions.forEach((menu) => {
                // For menu permissions
                if (rolePermissions[menu.id]) {
                    permissionsArray.push({
                        roleId: selectedRole,
                        menuId: menu.id,
                        subMenuId: null,
                        ...rolePermissions[menu.id],
                    });
                }
    
                // For submenu permissions (keep reference to parent menuId)
                menu.subMenus.forEach((subMenu) => {
                    if (rolePermissions[subMenu.id]) {
                        permissionsArray.push({
                            roleId: selectedRole,
                            menuId: menu.id,  // Keep the parent menu reference
                            subMenuId: subMenu.id,
                            ...rolePermissions[subMenu.id],
                        });
                    }
                });
            });
    
            await Promise.all(
                permissionsArray.map((perm) =>
                    axios.post("http://localhost:7171/api/permission/add-permission", perm)
                )
            );
    
            showToast("success", "Permissions updated successfully!");
            window.dispatchEvent(new Event("permissionsUpdated"));
        } catch (error) {
            console.error("Error saving permissions:", error);
            showToast("error", "Failed to update permissions.");
        }
    };

    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        setSelectedRole(roleId);
        if (roleId) {
            fetchRolePermissions(roleId);
        }
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
                                    <select className="form-control" value={selectedRole} onChange={handleRoleChange} required>
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
                                    <select className="form-control" value={parentFilter} onChange={(e) => setParentFilter(e.target.value)}>
                                        <option value="All">All</option>
                                        {Array.from(new Set(menuPermissions.map((menu) => menu.parentName).filter((parent) => parent))).map(
                                            (parent, index) => (
                                                <option key={index} value={parent}>
                                                    {parent || ""}
                                                </option>
                                            )
                                        )}
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
        .filter((menu) => parentFilter === "All" || menu.parentName === parentFilter)
        .sort((a, b) => {
            if (!a.parentName && b.parentName) return -1;
            if (a.parentName && !b.parentName) return 1;
            if (a.parentName === b.parentName) {
                return a.menuName.localeCompare(b.menuName);
            }
            return (a.parentName || "").localeCompare(b.parentName || "");
        })
        .map((menu) => (
            <>
                <tr key={menu.id} className="parent-menu">
                    <td>{menu.parentName || ""}</td>
                    <td>{menu.menuName || ""}</td>
                    <td><input type="checkbox" checked={rolePermissions[menu.id]?.read || false} onChange={() => handlePermissionChange(menu.id, "read")} /></td>

                    <td><input type="checkbox" checked={rolePermissions[menu.id]?.write || false} onChange={() => handlePermissionChange(menu.id, "write")} /></td>

                    <td><input type="checkbox" checked={rolePermissions[menu.id]?.canUpdate || false} onChange={() => handlePermissionChange(menu.id, "canUpdate")} /></td>

                    <td><input type="checkbox" checked={rolePermissions[menu.id]?.deletePermission || false} onChange={() => handlePermissionChange(menu.id, "deletePermission")} /></td>

                    <td><input type="time" className="form-control" value={rolePermissions[menu.id]?.startTime || ""} onChange={(e) => setRolePermissions((prev) => ({ ...prev, [menu.id]: { ...prev[menu.id], startTime: e.target.value } }))} /></td>

                    <td><input type="time" className="form-control" value={rolePermissions[menu.id]?.endTime || ""} onChange={(e) => setRolePermissions((prev) => ({ ...prev, [menu.id]: { ...prev[menu.id], endTime: e.target.value } }))} /></td>
                </tr>
                
                {menu.subMenus.length > 0 && menu.subMenus.map((subMenu) => (
                    <tr key={subMenu.id} className="submenu">
                        <td>{menu.menuName}</td>
                        
                        <td>{subMenu.menuName}</td>

                        <td><input type="checkbox" checked={rolePermissions[subMenu.id]?.read || false} onChange={() => handlePermissionChange(subMenu.id, "read")} /></td>

                        <td><input type="checkbox" checked={rolePermissions[subMenu.id]?.write || false} onChange={() => handlePermissionChange(subMenu.id, "write")} /></td>

                        <td><input type="checkbox" checked={rolePermissions[subMenu.id]?.canUpdate || false} onChange={() => handlePermissionChange(subMenu.id, "canUpdate")} /></td>

                        <td><input type="checkbox" checked={rolePermissions[subMenu.id]?.deletePermission || false} onChange={() => handlePermissionChange(subMenu.id, "deletePermission")} /></td>

                        <td><input type="time" className="form-control" value={rolePermissions[subMenu.id]?.startTime || ""} onChange={(e) => setRolePermissions((prev) => ({ ...prev, [subMenu.id]: { ...prev[subMenu.id], startTime: e.target.value } }))} /></td>

                        <td><input type="time" className="form-control" value={rolePermissions[subMenu.id]?.endTime || ""} onChange={(e) => setRolePermissions((prev) => ({ ...prev, [subMenu.id]: { ...prev[subMenu.id], endTime: e.target.value } }))} /></td>
                    </tr>
                ))}
            </>
        ))}
</tbody>
                </table>
            </div>
        </div>
                <div className="text-right mt-3">
                    <button className="btn btn-primary" onClick={handleSavePermissions}>
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
