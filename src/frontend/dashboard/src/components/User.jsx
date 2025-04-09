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
    },[])

    useEffect(() => {
        if (user.length > 0) {
            if (!$.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable();
            }
        }
    }, [user]);

   const fetchUsers = async() => {
    try {
        
        const response = await axios.get(`http://localhost:7171/api/user-data/list-users`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
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
        <div className="content-wrapper position-fixed">
                       <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6 mt-5">
                            <h2>User</h2>
                        </div>
                        <div className="col-sm-6 mt-5">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard "><i className="fa-solid fa-house" /></a></li>
                                <li className="breadcrumb-item active">User</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
             <div className="card">
                <div className="card-header">
                    <h4>User List</h4>
                </div>
                <div className="container-fluid">
                <button className="btn btn-danger ml-3 mt-2 text-center " onClick={() => navigate("/Register")}>Add User</button>
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
                </div>
                </section>
                
        {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}

export default User;