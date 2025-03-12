import { useNavigate } from "react-router-dom";
import axios from 'axios';
import $ from "jquery";
import "datatables.net-bs5";
import '../css/User.css'
import { useState, useEffect, useRef } from "react";

const User = () => {
    const navigate = useNavigate();
    const [user, setuser] = useState([]);
    const [error, setError] = useState('');
    const tableRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    })

    useEffect(() => {
        if (user.length > 0) {
            $(tableRef.current).DataTable(); 
        }
    }, [user]);


   const fetchUsers = async() => {
    try {
        
        const response = await axios.get(`http://localhost:7171/api/user-data/list-users`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        setuser(response.data.users);
        setError('');

    } catch (error) {
        setError(error.response?.data?.message);
        console.log(error);
    }
    }
    const handleEdit = (user) => {
        navigate("/EditUser", { state: { user } });
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <h3>User List</h3>
            </div>
             <div className="card">
                <button className="btn btn-danger mt-3 text-center float-end " onClick={() => navigate("/Register")}>Add User</button>
            <div className="content">
                <table ref={tableRef} className="table table-bordered table-striped table-compact">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((user) => (
                            <tr key={user.id}>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleEdit(user)}>
                                    <i className="fa fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}

export default User;