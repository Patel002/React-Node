import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import '../css/AdminLayout.css';
import logo from '../assets/logo.bmp';
import axios from 'axios';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [menuStructure, setMenuStructure] = useState({});
   
    const role = localStorage.getItem("role"); 
    const roleId = localStorage.getItem("roleId");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                let data;
                if (role === "superadmin") {

                    const response = await axios.get(`http://localhost:7171/api/menu/list-menu`);
                    data = response.data.data;
                    console.log(data)
                } else {
                    const response = await axios.get(`http://localhost:7171/api/permission/list?roleId=${roleId}`);
                    data = response.data.data;
                    console.log(response.data)
                }

                setMenuStructure(data);
            } catch (error) {
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu();
    }, [role, roleId]);
    

    useEffect(() => {
        if (window.$.AdminLTE) {
            window.$.AdminLTE.init();
        }   
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="wrapper">
          
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a href="/dashboard" className="brand-link">
                    <img src ={logo} alt="Admin Logo" className="brand-image img-circle elevation-2" style={{ opacity: '0.8',backgroundColor: 'white',borderRadius: '50%',width: '35px',height: '60px' }} />
                    <span className="font-weight-bold text-decoration-none">Admin Panel</span>
                </a>
                <div className="sidebar">
                <div className="form-inline mt-3">
                        <div className="input-group" data-widget="sidebar-search">
                            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-sidebar ">
                                    <i className="fas fa-search fa-fw"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
                            <li className="nav-item has-treeview">
                                <p className="nav-header mb-0 font-weight-bold
                                ">Access Control
                                </p>
                                <a href="#" className="nav-link d-flex align-items-center" onClick={toggleCollapse}>
                                    <i className="nav-icon fas fa-user-shield"></i>
                                    <p className="ml-2 mb-0">
                                        Super Admin
                                        <i className={`right fas ${isCollapsed ? "fa-angle-down" : "fa-angle-left"}`}></i>
                                    </p>
                                </a>
                                <ul className={`nav nav-treeview ${isCollapsed ? "d-block" : "d-none"}`}>
                                    <li className="nav-item">
                                        <Link to="/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === "/dashboard" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-tachometer-alt"></i>
                                            <p className="ml-2 mb-0">Dashboard</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/user" className={`nav-link d-flex align-items-center ${location.pathname === "/user" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-user-plus"></i>
                                            <p className="ml-2 mb-0">User</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/roles" className={`nav-link d-flex align-items-center ${location.pathname === "/roles" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-users-cog"></i>
                                            <p className="ml-2 mb-0">Roles</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/menu" className={`nav-link d-flex align-items-center ${location.pathname === "/menu" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-bars"></i>
                                            <p className="ml-2 mb-0">Menu</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/submenu" className={`nav-link d-flex align-items-center ${location.pathname === "/submenu" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-list"></i>
                                            <p className="ml-2 mb-0">Sub Menu</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/roleselection" className={`nav-link d-flex align-items-center ${location.pathname === "/roleselection  " ? "active" : ""}`}>
                                            <i className="nav-icon fa-solid fa-shield"></i>
                                            <p className="ml-2 mb-0">Role Permission</p>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <div className="user-panel d-flex align-items-center mt-2">
                            </div>
                            <ul className="nav nav-pills nav-sidebar flex-column">
                        {Object.values(menuStructure).map(menu => (
                            <li key={menu.id} className={`nav-item ${menu.submenus.length > 0 ? "has-treeview" : ""}`}>
                                {menu.submenus.length > 0 ? (
                                    <>
                                        <a href="#" className="nav-link">
                                            <i className={`nav-icon ${menu.icon}`} />
                                            <p>
                                                {menu.name}
                                                <i className="right fas fa-angle-left"></i>
                                            </p>
                                        </a>
                                        <ul className="nav nav-treeview">
                                            {menu.submenus.map(submenu => (
                                                <li key={submenu.id} className="nav-item">
                                                    <Link to={submenu.path} className="nav-link">
                                                        <i className={`nav-icon ${submenu.icon}`} />
                                                        <p>{submenu.name}</p>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Link to={menu.path} className="nav-link">
                                        <i className={`nav-icon ${menu.icon}`} />
                                        <p>{menu.name}</p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
    <li className="nav-item">
            <a href="#" className="nav-link text-danger d-flex align-items-center" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
                <i className="nav-icon fas fa-sign-out-alt"></i>
                <p className="ml-2 mb-0">Logout</p>
            </a>
        </li>
            </ul>
        </nav>
    </div>
</aside>
<Outlet />
</div>
    );

};

export default AdminLayout;
