 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import '../css/LoginPage.css';

const LoginPage = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let response;
            response = await axios.post(`http://localhost:7171/api/superadmin/admin-login`, {
                userName,
                password,
            });
    
            if (response.data.token) {
                const token = response.data.token;
                localStorage.setItem("token", token);
                const decodedToken = jwtDecode(token);
                console.log(decodedToken);
    
                if (decodedToken.role === 'super Admin') {
                    alert('Super Admin logged in successfully');
                    localStorage.setItem("role", decodedToken.role);
                    localStorage.setItem("roleId",decodedToken.id);
                    navigate('/dashboard');
                    return;
                }

                console.log(decodedToken.roleId);
            }
        } catch (error) {
           setError("Super Admin login failed, trying again...",error.response);
            alert(error.response)
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