import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedRole }) => {
    const role = sessionStorage.getItem("role");

    return role === allowedRole ? <Outlet /> : <Navigate to="/unauthorized" />;
};

ProtectedRoute.propTypes = {
    allowedRole: PropTypes.string.isRequired,
};

export default ProtectedRoute;