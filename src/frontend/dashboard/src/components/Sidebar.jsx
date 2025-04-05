import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "../css/Sidebar.css";

const SidebarMenu = ({ menuStructure, role }) => {
    const location = useLocation();
    const [collapsedMenus, setCollapsedMenus] = useState({});
    const [tokenRole, setTokenRole] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                setTokenRole(decodedToken?.role || null);
            } catch (error) {
                console.error("Invalid token format:", error);
            }
        }
    }, []);

    useEffect(() => {   
        console.log("Menu Structure:", menuStructure);
        console.log("User Role (Prop):", role);
        console.log("User Role (Token):", tokenRole);
        console.log("Current Path:", location.pathname);    
    }, [menuStructure, role, tokenRole, location.pathname]);

    const toggleCollapse = (menuId) => {
        setCollapsedMenus((prevState) => ({
            ...prevState,
            [menuId]: !prevState[menuId],
        }));
    };

    const buildMenuTree = (menuList) => {
        const menuMap = {};
        const rootMenus = [];

        menuList.forEach((menu) => {
            menu.submenus = [];
            menuMap[menu.id] = menu;
        });

        menuList.forEach((menu) => {
            if (menu.parent) {
                const parentMenu = menuList.find((m) => m.menuName === menu.parent);
                if (parentMenu) {
                    menuMap[parentMenu.id].submenus.push(menu);
                }
            } else {
                rootMenus.push(menu);
            }
        });

        return rootMenus;
    };

    const structuredMenu = buildMenuTree(menuStructure);

    const renderMenuItems = (menuList) => {
        if (!menuList || menuList.length === 0) return null;

        return menuList.map((menu) => {
            if (!menu) return null;

            return (
                <li key={menu.id} className={`nav-item ${menu.submenus.length > 0 ? "has-treeview" : ""} `}>
                    {menu.submenus.length > 0 ? (
                        <>
                            <a href="" className="nav-link" style = {{cursor:"pointer", padding:"8px",marginLeft:"9px"}} onClick={() => toggleCollapse(menu.id)}>
                                <i className={`nav-icon ${menu.icon || "fas fa-circle"}`} style={{ marginRight: "10px" }} />
                                <p>
                                    {menu.menuName}
                                </p>
                            </a>
                            <ul className={`nav nav-treeview transition ${collapsedMenus[menu.id] ? "menu-open" : "menu-close"}`}style={{paddingLeft:'20px', marginBottom:'-3px'}}>
                                {renderMenuItems(menu.submenus)}
                            </ul>
                        </>
                    ) : (
                        <Link to={menu.url || "#"} className={`nav-link ${location.pathname === menu.url ? "active" : ""}`}
                            style={{ padding: "8px", marginLeft: "9px" }}>
                            <i className={`nav-icon ${menu.icon || "fa-brands fa-pied-piper-hat"}`} />
                            <p>{menu.menuName}</p>
                        </Link>
                    )}
                </li>
            );
        });
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        window.location.href = "/login";
    };

    if (!tokenRole || tokenRole !== role) {
        return null;
    }

    return (
        <nav className="mt-2 adminlte-sidebar">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
            <li className="nav-header font-weight-bold">Menu</li>
                        <li className="nav-item">
                                        <Link to="/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === "/dashboard" ? "active" : ""}bg-secondry`}>
                                            <i className="nav-icon fas fa-tachometer-alt"></i>
                                            <p className="ml-2 mb-0">Dashboard</p>
                                        </Link>
                                    </li>
                {structuredMenu.length > 0 && (
                    <>
                        {renderMenuItems(structuredMenu)}
                    </>
                )}

                <li className="nav-item">
                    <a href="#" className="nav-link text-danger" onClick={handleLogout}>
                        <i className="nav-icon fas fa-sign-out-alt"></i>
                        <p>Logout</p>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

SidebarMenu.propTypes = {
    menuStructure: PropTypes.arrayOf(PropTypes.object).isRequired,
    role: PropTypes.string.isRequired,
};

export default SidebarMenu;
