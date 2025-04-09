import { useState, useEffect, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-bs5";
import showToast from "../helper/Toast";

const SubMenu = () => {
    const [SubMenus, setSubMenus] = useState([]);
    const [menu, setMenu] = useState([]);
    const [editData, setEditData] = useState(null);
    const [error, setError] = useState('');
    const tableRef = useRef(null);

    const [formData, setFormData] = useState({
        mainMenu: '',
        subMenuName: '',
        url: '',
        active: 'ACTIVE'
    })

    useEffect(() => {
        fetchSubMenu();
        fetchMainMenu();
    }, []); 

    useEffect(() => {
        if (SubMenus.length > 0) {
            $(tableRef.current).DataTable(); 
        }
    }, [SubMenus]);

    const handleEdit = (sub) => {
        setEditData(sub); 
        setFormData({
            mainMenu: sub.menuName,
            subMenuName: sub.subMenuName,
            url: sub.url,
            active: sub.active,
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

            await axios.patch(`http://localhost:7171/api/submenu/update-sub-menu/${editData.id}`, updatedFields);
            setEditData(null); 
            fetchSubMenu();
            showToast("success",'Menu updated successfully');
            setError('');
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this menu?")) return;
        try {
            await axios.delete(`http://localhost:7171/api/submenu/delete-sub-menu/${id}`);
            fetchSubMenu();
            setError('');
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message);
        }
    };

    const fetchSubMenu = async () => {
        try {
            const response = await axios.get('http://localhost:7171/api/submenu/list-sub-menu');
            setSubMenus(response.data.subMenu || []);
            setError('');     
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message);
        }
    }

    const fetchMainMenu = async () => {
        try {
            const response = await axios.get('http://localhost:7171/api/menu/list-menu');
            setMenu(response.data.menu || []);
            setError('');
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:7171/api/submenu/create-sub-menu', formData);
            if (response.status === 200 || response.status === 201) {
                setSubMenus([...SubMenus, response.data.subMenu]);
                setFormData({
                    mainMenu: '',
                    subMenuName: '',
                    url: '',
                    active: 'ACTIVE'
                })
                setError('');
                fetchSubMenu();
            }
        } catch (error) {
            setError(error.response?.data?.message);
            console.log(error);
        }
    }

    const handleReset = () => {
        setFormData({
            mainMenu: "",
            subMenuName: "",
            url: "",
            active: "ACTIVE",
        });
    };

    return (
        <div className="content-wrapper">
             <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6 mt-5">
                            <h1>Sub Menu</h1>
                        </div>
                        <div className="col-sm-6 mt-5">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard"><i className="fa-solid fa-house" /></a></li>
                                <li className="breadcrumb-item active">Sub Menu </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                        <div className="card-header bg-white text-black">
                        <h3 className="card-title"> <i className ="fa-solid fa-plus mr-2" />{editData ? "Update Sub Menu" : "Add Sub Menu"}</h3>
                        </div>
                        
                        <div className="card-body">
                        <form onSubmit={editData ? handleUpdate : handleSubmit}>
                            <div className="mb-3">
                                <select
                                    name="mainMenu"
                                    value={formData.mainMenu}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select Main Menu</option>
                                    {menu.map((menuItem) => (
                                        <option key={menuItem.id} value={menuItem.menuName}>
                                            {menuItem.menuName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="subMenuName"
                                    value={formData.subMenuName}
                                    onChange={handleChange}
                                    placeholder="SubMenu Name"
                                    className="form-control"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="URL"
                                    className="form-control"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <select name="active" value={formData.active} onChange={handleChange} className="form-control">
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                            <div className="mt-3 flex space-x-2">
                            <button type="submit" className="btn btn-primary w-25">
                            <i className="fa-solid fa-check mr-2" />
                                    {editData ? 'Update' : 'Save'}
                                </button>
                                
                                <button type="button" onClick={handleReset} className="btn w-25 ml-2 bg-danger">Reset</button>
                            </div>
                            {error && <p className="text-danger mt-3">{error}</p>}
                        </form>
                    </div>
                    </div>
                    </div>

                    <div className="col-md-8">
                    <div className="card">
                    <div className="card-header bg-white text-black ">
                        <h3 className="card-title">
                        <i className="fa-solid fa-list-check mr-2" />
                            Sub Menus List</h3>
                    </div>
                    <div className="card-body">
                        <table ref={tableRef} className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Main Menu</th>
                                    <th>SubMenu</th>
                                    <th>URL</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SubMenus.map((sub) => (
                                    <tr key={sub.id}>
                                        <td>{sub.mainMenu}</td>
                                        <td>{sub.subMenuName}</td>
                                        <td>{sub.url}</td>
                                        <td>{sub.active === "ACTIVE" ? "Active" : "Inactive"}</td>
                                        <td>
                                            <button onClick={() => handleEdit(sub)} className="btn btn-primary btn-sm me-2">
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button onClick={() => handleDelete(sub.id)} className="btn btn-danger btn-sm">
                                                <i className="fa fa-trash"></i>
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
}
export default SubMenu;