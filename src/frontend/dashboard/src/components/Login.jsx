 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import '../css/LoginPage.css';
import showToast from '../helper/Toast';

const LoginPage = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let apiUrls =[`http://localhost:7171/api/superadmin/admin-login`,`http://localhost:7171/api/user-data/login-user`]


            for (let apiUrl of apiUrls) {
                try {
                    const response = await axios.post(apiUrl, { userName, password });
        
                    if (response.data.token) {
                        handleSuccessfulLogin(response.data.token);
                        return;
                    }
                } catch (error) {
                    console.log(`Login failed at ${apiUrl}, trying next...`, error.response.data);
                }
            } 
        } catch (error) {
           setError("Super Admin login failed, trying again...",error.response);
            showToast("error",error.response.data.message); 
        }
    };    


    const handleSuccessfulLogin = (token) => {
        sessionStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);

        sessionStorage.setItem("role", decodedToken.role);
        sessionStorage.setItem("roleId", decodedToken.roleId);
        console.log("ROLE*ID",decodedToken.roleId);

        showToast("success", `${decodedToken.role} logged in successfully`);

        if (decodedToken.role === "super admin") {
            navigate("/dashboard");
        } else {
            navigate("/dashboard"); 
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="login-logo">
                    <b>Admin</b>
                    <span>LTE</span>
                </div>
                    <div className="card-body login-card-body">
                        <p className="login-box-msg">Sign in to start your session</p>

                        {error && <p className="text-danger text-center">{error}</p>}

                        <form onSubmit={handleLogin}>
                            <div className="input-group mb-3">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Username" 
                                    value={userName} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group mb-3">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary btn-block">
                                     Login In
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    );
}


export default LoginPage;