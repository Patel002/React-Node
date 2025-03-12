import { useState, useEffect } from "react";
import { useNavigate    } from "react-router-dom";
import axios from "axios";

const RolePermission = () => {

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(localStorage.getItem("selectedRole") || "");
    const [parentFilter, setParentFilter] = useState(localStorage.getItem("parentFilter") || "All");

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
        localStorage.setItem("selectedRole", selectedRole);
    }, [selectedRole]);

    useEffect(() => {
        localStorage.setItem("parentFilter", parentFilter);
    }, [parentFilter]);


    const fetchRoles = async () => {
        try {
           const response = await axios.get("http://localhost:7171/api/role/list-role");
           setRoles(response.data.roles);
        } catch (error) {
        console.log(error);
        }
    }

    const fetchRolePermissions = async (roleId) => {
        try {
            const response = await axios.get(`http://localhost:7171/api/permission/list-permission?roleId=${roleId}`);
            const permissionsData = response.data.permissions || {};
            const permissionMap = {};
            permissionsData.forEach((perm) => {
                permissionMap[perm.menuId] = {
                    read: perm.read,
                    write: perm.write,
                    update: perm.update,
                    deletePermission: perm.deletePermission,
                    startTime: perm.startTime || "",
                    endTime: perm.endTime || "",
                };
            });

            setRolePermissions(permissionMap);
        } catch (error) {
            console.error("Error fetching role permissions:", error);
        }
    }
    const fetchMenuPermissions = async () => {
        try {
            const response = await axios.get(`http://localhost:7171/api/permission/all-menu-permissions`);
            setMenuPermissions(response.data.data);
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
            const permissionsArray = Object.keys(rolePermissions).map((menuId) => ({
                roleId: selectedRole,
                menuId,
                ...rolePermissions[menuId],
            }));
    
            await Promise.all(
                permissionsArray.map((perm) =>
                    axios.post("http://localhost:7171/api/permission/add-permission", perm)
                )
            );

            alert("Permissions updated successfully!");
    
        } catch (error) {
            console.error("Error saving permissions:", error);
            alert("Failed to update permissions.");
        }
    };
    
    

    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        setSelectedRole(roleId);
        if (roleId) {
            navigate();
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
                        <li className="breadcrumb-item"><a href=""><i className="fa-solid fa-house" /></a></li>
                        <li className="breadcrumb-item active">Sub Menu</li>
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
                                    <select className="form-control" value={selectedRole} onChange={handleRoleChange}>
                                        <option value="">Select Role</option>
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

                            {/* Table */}
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
                                    <tr key={menu.id}>
                                        <td>{menu.parentName || ""}</td>
                                        <td>{menu.menuName || ""}</td>
                                        <td>
                                    <input
                                        type="checkbox"
                                        checked={rolePermissions[menu.id]?.read || false}
                                        onChange={() => handlePermissionChange(menu.id, "read")}
                                    />
                                        </td>
                                        <td>
                                    <input
                                        type="checkbox"
                                        checked={rolePermissions[menu.id]?.write || false}
                                        onChange={() => handlePermissionChange(menu.id, "write")}
                                    />
                                        </td>
                                        <td>
                                    <input
                                        type="checkbox"
                                        checked={rolePermissions[menu.id]?.update || false}
                                        onChange={() => handlePermissionChange(menu.id, "update")}
                                    />
                                        </td>
                                        <td>
                                    <input
                                        type="checkbox"
                                        checked={rolePermissions[menu.id]?.deletePermission || false}
                                        onChange={() => handlePermissionChange(menu.id, "deletePermission")}
                                    />
                                        </td>
                                        <td>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={rolePermissions[menu.id]?.startTime || ""}
                                    onChange={(e) =>
                                        setRolePermissions((prev) => ({
                                            ...prev,
                                            [menu.id]: {
                                                ...prev[menu.id],
                                                startTime: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                        </td>
                                        <td>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={rolePermissions[menu.id]?.endTime || ""}
                                    onChange={(e) =>
                                        setRolePermissions((prev) => ({
                                            ...prev,
                                            [menu.id]: {
                                                ...prev[menu.id],
                                                endTime: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                </td>
                            </tr>
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
