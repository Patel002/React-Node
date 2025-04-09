import { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
// import { debounce } from "lodash";
import '../css/Register.css';
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

const RegisterUser = () => {
    const location = useLocation();
    const editUser = location.state?.user || null;
    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        countryCode: '+91',
        role: ''
    });

    const [roles, setRoles] = useState([]);
    useEffect(()=> {
       fetchRoles();
    },[])

        useEffect(() => {
        if (editUser) {
            setFormData(editUser);
        }
    }, [editUser]);


    const fetchRoles = async() => {
        try {
            const res = await axios.get(`http://localhost:7171/api/role/list-role`); 
            setRoles(res.data.roles);
        } catch (error) {
            // alert(error);
            console.warn(error);
        }
    }

    const [showPaswordRequiredment, setShowPasswordRequiredment] = useState(false);
    const[passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false
    })


    const[showEmailRequiredment, setShowEmailRequiredment] = useState(false);
    const[emailValidation, setEmailValidation] = useState({
        isEmail: false
    })

    const[showPhoneRequiredment, setShowPhoneRequiredment] = useState(false);
    
    const [phoneValid, setPhoneValid] = useState(false);

    const handelChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });

        if(e.target.name === 'password') {
            validatePassword(e.target.value);
        }

        if(e.target.name === 'email') {
            validateEmail(e.target.value);
        }

        if(e.target.name === 'phone'){
            validatePhone(e.target.value);
        }
    };

    const validatePassword = (password) => {
        setPasswordValidation({
            minLength: password.length >= 6,
            upperCase: /[A-Z]/.test(password),
            lowerCase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*()\-_=+]/.test(password)  
        })? "Invalid Password": "Valid Password";
    };

    const validateEmail = (email) => {
        setEmailValidation({
            isEmail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
    })
};

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10,15}$/;
        setPhoneValid(phoneRegex.test(phone));
    };

    const handleSumbit = async (e) => {
        e.preventDefault();

        const phoneNumber = formData.phone ? formData.countryCode + formData.phone : null;

        if (Object.values(passwordValidation).includes(false)) {
            showToast("Please meet all password requirements before submitting.");
            return;
        }

        if (Object.values(emailValidation).includes(false)) {
            showToast("Please enter a valid email address before submitting.");
            return;
        }

        try{
            const response = await axios.post(`http://localhost:7171/api/user-data/register`,{
                ...formData,
                phone: phoneNumber
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            console.log("response data",response.data);
            if(response.status === 200 || response.status === 201){
                showToast('User Registered Successfully');

                setFormData({
                    userName: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phone: '',
                    countryCode: '+91',
                    role: ''
                });
    
            }
        }
        catch (error) {
            console.error(error);
            showToast(`User Registration Failed: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6 mt-5">
                            <h4 className="m-0"><i className="fa-solid fa-user" /> User Registration</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="card mt-2">
                <div className ="container-fluid mt-3">
                <div className="row justify-content-center">
                {/* <div className="card-header">
                            <h3 className="card-title">Register User</h3>
                        </div> */}
                        <form onSubmit={handleSumbit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Username</label>
                                            <input type="text" className="form-control" name="userName" value={formData.userName} onChange={handelChange} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handelChange} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handelChange} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handelChange} onFocus={() => setShowEmailRequiredment(true)} onBlur={() => setShowEmailRequiredment(false)} required />
                                    {showEmailRequiredment && (
                                        <div className="alert alert-warning alert-dismissible mt-2">
                                            <p className={`${emailValidation.isEmail ? "text-success" : "text-danger"}`}>
                                                {emailValidation.isEmail ? '✅' : '❌'} Email must be valid format e.g., example@domain.com
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                               
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handelChange} onFocus={() => setShowPasswordRequiredment(true)} onBlur={() => setShowPasswordRequiredment(false)} required />
                                    {showPaswordRequiredment && (
                                        <div className="alert alert-warning alert-dismissible mt-2">
                                            <p className={`${passwordValidation.minLength ? "text-success" : "text-danger"}`}>
                                                {passwordValidation.minLength ? '✅' : '❌'} At least 6 characters
                                            </p>
                                            <p className={`${passwordValidation.upperCase ? "text-success" : "text-danger"}`}>
                                                {passwordValidation.upperCase ? '✅' : '❌'} Contains at least 1 uppercase letter
                                            </p>
                                            <p className={`${passwordValidation.lowerCase ? "text-success" : "text-danger"}`}>
                                                {passwordValidation.lowerCase ? '✅' : '❌'} At least 1 lowercase letter
                                            </p>
                                            <p className={`${passwordValidation.number ? "text-success" : "text-danger"}`}>
                                                {passwordValidation.number ? '✅' : '❌'} Include At least 1 number
                                            </p>
                                            <p className={`${passwordValidation.specialChar ? "text-success" : "text-danger"}`}>
                                                {passwordValidation.specialChar ? '✅' : '❌'} Include at least 1 special character, e.g., !@#$%^&*()-_+=
                                            </p>
                                        </div>
                                    )}
                                </div>
                                </div>

                                    <div className="col-md-6">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <div className="input-group">
                                        <select name="countryCode" value={formData.countryCode} onChange={handelChange} className="form-control">
                                            {countryCodes.map((c) => (
                                                <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                                            ))}
                                        </select>
                                        <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handelChange} onFocus={() => setShowPhoneRequiredment(true)} onBlur={() => setShowPhoneRequiredment(false)} />
                                    </div>
                                    {showPhoneRequiredment && (
                                        <div className="alert alert-warning alert-dismissible mt-2">
                                            <p className={`${phoneValid ? "text-success" : "text-danger"}`}>
                                                {phoneValid ? '✅' : '❌'} Phone number must be valid between 10-15 numbers
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                                <div className="form-group">
                                    <label>Role</label>
                                    <select name="role" value={formData.role} onChange={handelChange} className="form-control" required>
                                        <option value="">Select Role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.roleName}>{role.roleName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className=" mb-3 text-right">
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
        </div>
     </div>
    );

}
export default RegisterUser;