import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const EditUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const editUser = location.state?.user || null;

    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        password: '',
        email: '',
        phone: '',
        countryCode: '+91',
        role: ''
    });

    useEffect(() => {
        if (editUser) {
            
            let countryCode = "+91"; 
            let phoneNumber = editUser.phone || "";

            if (phoneNumber.includes("+")) {
                const splitPhone = phoneNumber.split("");
                if (splitPhone.length > 1) {
                    countryCode = splitPhone[0]; 
                    phoneNumber = splitPhone.slice(1).join(""); 
                }
            }
            setFormData({
                userName: editUser.userName || "",
                firstName: editUser.firstName || "",
                lastName: editUser.lastName || "",
                password: editUser.password || "",
                email: editUser.email || "",
                phone: editUser.phone || "",
                countryCode: countryCode,
                role: editUser.role || ""
            });
        }
    }, [editUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
       
        if (!editUser.id) {
            alert("No user selected for update");
            return;
        }

        try {
            await axios.patch(
                `http://localhost:7171/api/user-data/update-user/${editUser.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            alert('User Updated Successfully');
            navigate("/user");
        } catch (error) {
            console.log(error);
            alert(`User Update Failed: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <h3>Edit User</h3>
            </div>
            <div className="content">
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" name="userName" value={formData.userName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                        <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input type="text" className="form-control" name="role" value={formData.role} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-success">Update</button>
                    <button type="button" className="btn btn-secondary ml-2" onClick={() => navigate("/user")}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default EditUser;
