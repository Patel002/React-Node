import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "datatables.net-bs5";
import $ from "jquery";
import '../css/Menu.css'
import showToast from "../helper/Toast";

const MenuManagement = () => {
    const [menu, setMenu] = useState([]);
    const [error, setError] = useState('');
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({
        menuName: '',
        url: '',
        icon: '',
        parent: '',
        active: 'ACTIVE',
        sequence: ''
    });
    const tableRef = useRef(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    useEffect(() => {
        if (menu.length > 0) {
            $(tableRef.current).DataTable();
        }
    }, [menu]);


    const fetchMenu = async () => {
        try {
            const res = await axios.get('http://localhost:7171/api/menu/list-menu');
            setMenu(res.data.menu || []);
            setError('');
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message);
        }
    };

    const handleEdit = (menuItem) => {
        setEditData(menuItem);
        setFormData({
            menuName: menuItem.menuName,
            url: menuItem.url,
            icon: menuItem.icon,
            parent: menuItem.parent || '',
            active: menuItem.active,
            sequence: menuItem.sequence || ''
        });
        setError('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editData) return;

        try {
            const updatedFields = {};
            for (const key in formData) {
                if (formData[key] !== "" && formData[key] !== null) {
                    updatedFields[key] = formData[key];
                }
            }

            await axios.patch(`http://localhost:7171/api/menu/update-menu/${editData.id}`, updatedFields);
            setEditData(null);
            fetchMenu();
            showToast("success", 'Menu updated successfully');
            setError('');
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this menu?")) return;
        try {
            await axios.delete(`http://localhost:7171/api/menu/delete-menu/${id}`);
            fetchMenu();
            setError('');
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:7171/api/menu/create-menu', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 200 || res.status === 201) {
                setFormData({
                    menuName: '',
                    url: '',
                    icon: '',
                    parent: '',
                    active: 'ACTIVE',
                    sequence: ''
                });
                setError('');
                fetchMenu();
            }

        } catch (error) {
            setError(error.response?.data?.message);
            console.log(error);
        }
    };

    const handleReset = () => {
        setFormData({
            menuName: '',
            url: '',
            icon: '',
            parent: '',
            active: 'ACTIVE',
            sequence: ''
        });
    };

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Menu</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#"><i className="fa-solid fa-house" /></a></li>
                                <li className="breadcrumb-item active">Menu </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card">
                                <div className="card-header bg-white text-black mt-2">
                                    <h3 className="card-title"> <i className="fa-solid fa-plus mr-2" />{editData ? "Update Menu" : "Add Menu"}</h3>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={editData ? handleUpdate : handleSubmit}>
                                        <div className="mb-3">
                                            <input type="text" name="menuName" value={formData.menuName} onChange={handleChange} placeholder="Menu Name" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="URL" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="Icon" className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <select name="parent" value={formData.parent} onChange={handleChange} className="form-control">
                                                <option value="">Parent</option>
                                                {menu.map((menuItem) => (
                                                    <option key={menuItem.id} value={menuItem.menuName}>{menuItem.menuName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <select name="active" value={formData.active} onChange={handleChange} className="form-control">
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-25" aria-hidden="true" >
                                            <i className="fa-solid fa-check mr-2" />{editData ? 'Update' : 'Save'}
                                        </button>

                                        <button type="button" onClick={handleReset} className="btn w-25 ml-2 bg-danger">Reset</button>
                                    </form>
                                    {error && <p className="text-danger mt-2">{error}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card">
                                <div className="card-header bg-white text-black mt-2">
                                    <h3 className="card-title">
                                        <i className="fa-solid fa-list-check mr-2" />
                                        Menus List</h3>
                                </div>
                                <div className="card-body">
                                    <table ref={tableRef} className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Menu</th>
                                                <th>Icon</th>
                                                <th>Parent</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {menu.map(menuItem => (
                                                <tr key={menuItem.id}>
                                                    <td>{menuItem.menuName}</td>
                                                    <td>{menuItem.icon}</td>
                                                    <td>{menuItem.parent || "None"}</td>
                                                    <td>{menuItem.active}</td>
                                                    <td>
                                                        <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEdit(menuItem)}><i className="fas fa-edit"></i></button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(menuItem.id)}><i className="fas fa-trash" /></button>
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

export default MenuManagement;