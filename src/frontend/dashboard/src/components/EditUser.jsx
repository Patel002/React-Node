import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import showToast from "../helper/Toast";


const countryCodes = [
    { code: "+1",  country: "USA" },
    { code: "+91", country: "India" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+86", country: "China" },
  ];
  
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
        countryCode: '',
        role: ''
    });

     const [roles, setRoles] = useState([]);
        useEffect(()=> {
           fetchRoles();
        },[])

        const [newPassword, setNewPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [passwordError, setPasswordError] = useState(""); 
        const [confirmPasswordError, setConfirmPasswordError] = useState("");

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{6,}$/;

        const validatePassword = (value) => {
            if (!passwordRegex.test(value)) {
                setPasswordError("Password must be at least 6 characters and contain only letters, numbers, and !@#$%^&*()-_+=");
            } else {
                setPasswordError("");
            }
        };

        const validateConfirmPassword = (value) => {
            if (value !== newPassword) {
                setConfirmPasswordError("Passwords do not match");
            } else {
                setConfirmPasswordError("");
            }
        };
            
        const handlePasswordChange = (e) => {
            const value = e.target.value;
            setNewPassword(value);
            validatePassword(value);
        };

          const handleConfirmPasswordChange = (e) => {
          const value = e.target.value;
          setConfirmPassword(value);
          validateConfirmPassword(value);
        };

        // const handleSubmit = (e) => {
        //     e.preventDefault();
        //     if (newPassword !== confirmPassword) {
        //         alert("Passwords do not match");
        //         return;
        //     }
        // };

           const fetchRoles = async() => {
                try {
                    const res = await axios.get(`http://localhost:7171/api/role/list-role`); 
                    setRoles(res.data.roles);
                } catch (error) {
                    console.warn(error);
                }
            }

            useEffect(() => {
                if (editUser) {
                    let fullPhone = editUser.phone || "";
                    let matchedCode = countryCodes.find(item => fullPhone.startsWith(item.code));
                    let countryCode = matchedCode ? matchedCode.code : "";
                    let phoneWithoutCode = matchedCode ? fullPhone.replace(matchedCode.code, "") : fullPhone;
            
                    setFormData({
                        userName: editUser.userName || "",
                        firstName: editUser.firstName || "",
                        lastName: editUser.lastName || "",
                        password: editUser.password || "",
                        email: editUser.email || "",
                        phone: phoneWithoutCode,
                        countryCode: countryCode || "+91", 
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

        const phoneOnly = formData.phone.replace(/\D/g, ""); 
        if (phoneOnly.length < 10 || phoneOnly.length > 15) {
            showToast("error", "Phone number must be between 10 to 15 digits (excluding country code)");
            return;
        }
    
        if (!editUser.id) {
            showToast("error", "No user selected for update");
            return;
        }
    
        const updatedData = {
            ...formData,
            phone: `${formData.countryCode}${formData.phone}`
        };
    
        try {
            const response = await axios.patch(
                `http://localhost:7171/api/user-data/update-user/${editUser.id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                }
            );
    
            if (response.status === 200) {
                showToast("success", "User updated successfully");
            }
        } catch (error) {
            console.log(error);
            showToast("error", `User Update Failed: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };
    

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!passwordRegex.test(newPassword)) {
            showToast("error", "Password must be at least 6 characters and contain only letters, numbers, and !@#$%^&*()-_+=");
            return;
        }
    
        try {
            await axios.patch(`http://localhost:7171/api/user-data/update-password/${editUser.id}`, {
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            })
            setNewPassword("");
            setConfirmPassword("");

            showToast("success", "Password updated successfully");
        } catch (error) {
            console.log(error);
            
            showToast("error", `Password Update Failed: ${error.response?.data?.message || 'Unknown error'}`);

        }
    }

    return (
        <div className="content-wrapper">
            <div className="content-header mt-4">
                <h3>Edit User</h3>
            </div>
            <div className="card">
            <div className="card-header">
                        <h5 className="mt-1 mb-1">General Info
                        </h5>
                    </div>
            <div className="content">
                <form onSubmit={handleUpdate}>
                    <div className="card">
                        <div className="card-header">
                    <div className="row">
                    <div className="form-group col-md-4">
                        <label>Username</label>
                        <input type="text" className="form-control" name="userName" value={formData.userName} onChange={handleChange} />
                    </div>
                    <div className="form-group col-md-4">
                        <label>First Name</label>
                        <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group col-md-4">
                        <label>Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" name="email" autoComplete="off" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group col-md-4">
                    <label>Phone</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <select
                        name="countryCode"
                        className="form-control"
                        style={{ width: "30%" }}
                        value={formData.countryCode}
                        onChange={handleChange}
                        >
                        {countryCodes.map((item, index) => (
                            <option key={index} value={item.code}>
                            {item.code} ({item.country})
                            </option>
                        ))}
                        </select>
                        <input
                        type="text"
                        className="form-control"
                        style={{ width: "70%" }}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="off"
                        />
                    </div>    

                    </div>
                    <div className="form-group col-md-4">
                                    <label>Role</label>
                                    <select name="role" value={formData.role}
                                    onChange={handleChange} className="form-control"
                                    autoComplete="off"
                                     required>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.roleName}>{role.roleName}</option>
                                        ))}
                                    </select>
                                </div>
                                </div>
                            
                    <button type="submit" className="btn btn-success col-md-1">Update</button>
                    <button type="button" className="btn btn-secondary ml-2 col-md-1" onClick={() => navigate("/user")}>Cancel</button> 
                    </div>
                    </div>
                </form>
            </div>
            <div className="card mt-2 ml-3 mr-3">
            <div className="card-header">
                        <h5 className="mt-1 mb-1">Change Password</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleChangePassword}>
                        <div className="row">
                            <div className="form-group col-md-3">
                                <label>New Password</label>
                                <input type="password" className="form-control"
                                value={newPassword} 
                                onChange={handlePasswordChange}
                                required
                                 />
                                   {passwordError && <small className="text-danger">{passwordError}</small>}
                            </div>
                            <div className="form-group col-md-3">
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={confirmPassword} 
                                onChange={handleConfirmPasswordChange} 
                                required 
                            />
                            {confirmPasswordError && <small className="text-danger">{confirmPasswordError}</small>}
                        </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save </button>
                        </form>
                    </div>
            </div>
        </div>
        </div>
    );
}

export default EditUser;
