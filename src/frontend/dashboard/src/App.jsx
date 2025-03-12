import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";    
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RegisterUser from "./components/RegisterUser";
import Role from "./components/Role";
import MenuManagement from "./components/Menu";
import SubMenu from "./components/SubMenu";
import RoleSelection from "./components/RoleSelection";
import RolePermission from "./components/RolePermission";
import User from "./components/User";
import EditUser from "./components/EditUser";

function App() {
    return (
      <Router>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="register" element={<RegisterUser />} />
              <Route path="roles" element={<Role />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="submenu" element={<SubMenu />} />
              <Route path="/roleselection" element={<RoleSelection />} />
              <Route path="/permissions" element={<RolePermission />} />
              {/* <Route path="sidebar" element={<Sidebar />} /> */}
              <Route path="user" element={<User />} />
              <Route path="/edituser" element={<EditUser />} />
          </Route>
      </Routes>
  </Router>

    );
}

export default App;
