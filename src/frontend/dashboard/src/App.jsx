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
import ProtectedRoute from  "./components/ProtectedRoutes";
import UnauthorizedPage from "./components/UnAuthorizedPage";
import UserProfile from "./components/UserProfile";
import Info from "./components/Info";
import Setting from "./components/Settings";
import { AnimatePresence } from 'framer-motion';

function App() {
    return (
      <Router>
      <AnimatePresence mode="wait">
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
          <Route element={<ProtectedRoute allowedRole="super admin" />}>
              <Route path="register" element={<RegisterUser />} />
              <Route path="roles" element={<Role />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="submenu" element={<SubMenu />} />
              <Route path="roleselection" element={<RoleSelection />} />
              <Route path="permissions" element={<RolePermission />} />
              <Route path="user" element={<User />} />
              <Route path="edituser" element={<EditUser />} />
          </Route>  

          <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-profile" element={<UserProfile />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="menu/master/companyInfo" element={<Info />} />
          <Route path="settings/:section?" element={<Setting />} />
          </Route>
          
      </Routes>
      </AnimatePresence>
  </Router>

    );
}

export default App;
