import { useState, useEffect, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-bs5";
import '../css/Role.css';
import showToast from "../helper/Toast";

const Role = () => {
    const [roles, setRoles] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState('');
    const [editData, setEditData] = useState(null);
    const tableRef = useRef(null);


    useEffect(() => {
        fetchRoles();
    }, [])

    useEffect(() => {
        if (roles.length > 0) {
            $(tableRef.current).DataTable();
        }
    }, [roles]);

    const handleEdit = (role) => {
        setRoleName(role.roleName);
        setEditData(role);
        setError('');
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!roleName) {
            setError("role name cannot be empty");
            return;
        }
        try {
            const response = await axios.patch(`http://localhost:7171/api/role/update-role?id=${editData.id}`, { roleName });
            setRoleName('');
            setEditData(null);
            setError('');
            fetchRoles();

            console.log(response);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    }

    const fetchRoles = async () => {
        try {
            const res = await axios.get(`http://localhost:7171/api/role/list-role`);
            setRoles(res.data.roles);
            setError('');

        } catch (error) {
            console.error("Error fetching roles:", error);
            setError(error.response?.data?.message)

        }
    }

    const handleAddRole = async (e) => {
        e.preventDefault();

        if (!roleName) {
            setError("role name cannot be empty");
            return;
        }

        if (["Super Admin", "super admin", "superadmin", "SuperAdmin", "superAdmin"].includes(roleName)) {

            setError("Super Admin role cannot be added");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:7171/api/role/add-role`, { roleName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (res.status === 200 || res.status === 201) {
                setRoleName('');
                setError('');
                fetchRoles();
                showToast("success", "Role added successfully");

            } else {
                setError("error while adding role");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "error while adding role");
        }
    }

    return (
        <div className="content-wrapper position-fixed">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6 mt-5">
                            <h1>User Roles</h1>
                        </div>
                        <div className="col-sm-6 mt-5">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">
                                        <i className="fa-solid fa-house" />
                                    </a>
                                </li>
                                <li className="breadcrumb-item active">Roles</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header bg-white text-black">
                                    <h3 className="card-title">
                                        <i className="fa-solid fa-plus mr-2" />
                                        {editData ? "Edit Role" : "Add Role"}
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={editData ? handleUpdate : handleAddRole}>
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                value={roleName}
                                                onChange={(e) => setRoleName(e.target.value)}
                                                className="form-control mb-2"
                                                placeholder="Enter Role Name"
                                                required
                                            />
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="submit"
                                                    className={`btn ${editData ? 'btn-warning' : 'btn-primary'} w-25`}
                                                >
                                                    <i className="fa-solid fa-check " /> {editData ? "Update" : "Save"}
                                                </button>
                                                {editData && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary w-25"
                                                        onClick={() => {
                                                            setRoleName('');
                                                            setEditData(null);
                                                            setError('');
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-xmark" /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {error && <p className="text-danger mt-2">{error}</p>}
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header bg-white text-black">
                                    <h3 className="card-title">
                                        <i className="fa-solid fa-list-check mr-2" />
                                        Role List
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <table ref={tableRef} className="table table-striped table-bordered">
                                        <thead className="bg-secondary text-white">
                                            <tr>
                                                <th>Sr.</th>
                                                <th>Role Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roles.map((role, index) => (
                                                <tr key={role.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{role.roleName}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleEdit(role)}
                                                            className="btn btn-primary btn-sm mx-1"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Role;