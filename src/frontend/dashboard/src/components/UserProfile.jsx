import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import showToast from '../helper/Toast';
import logo from '../assets/logo.bmp';

const UserProfile = () => {
    const [user, setUser] = useState({
        id: "",
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        profileImage: "",
    });

    const userId = sessionStorage.getItem("id");

    const userProfile = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:7171/api/user-data/user-profile/${userId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            showToast("error", "Error fetching user profile");
        }
    }, [userId]);

    useEffect(() => {
        userProfile();
    }, [userProfile]);

    return (
<div className="content-wrapper mt-5">
    <div className="content-header">
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card card-secondary mt-4 shadow">
                        <div className="card-header">
                            <h3 className="card-title">User Profile</h3>
                        </div>
                        <form className="p-4">
                            <div className="card-body">
                                <div className="row justify-content-center mb-4">
                                    <div className="col-md-3 text-center">
                                        <img
                                            src={
                                                user.profileImage
                                                    ? user.profileImage
                                                    : ` ${logo}`
                                            }
                                            className="img-fluid img-circle elevation-2"
                                            alt="User Profile"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                                border: "3px solid rgba(199, 210, 223, 0.49)"
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row mb-3">
                                    <label className="col-sm-2 col-form-label">Username</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.userName || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="form-group row mb-3">
                                    <label className="col-sm-2 col-form-label">First Name</label>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.firstName || ''}
                                            readOnly
                                        />
                                    </div>

                                    <label className="col-sm-2 col-form-label">Last Name</label>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.lastName || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="form-group row mb-3">
                                    <label className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={user.email || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="form-group row mb-3">
                                    <label className="col-sm-2 col-form-label">Phone</label>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.phone || 'Not Provided'}
                                            readOnly
                                        />
                                    </div>

                                    <label className="col-sm-2 col-form-label">Role</label>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.role || 'User'}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    );
};

export default UserProfile;
