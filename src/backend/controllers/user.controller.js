import {User} from "../model/user.model.js";
import { Role } from "../model/roles.model.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const getAllUserData = async (req, res) => {
    const {userName,firstName, lastName, email, password,role} = req.body;

    let { phone } = req.body;

    if(!userName || !firstName || !lastName || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }
    try {

        phone = phone || null;

        const checkUserPresent = await User.findOne({
            where: {
                [Op.or]: [
                    { userName }, 
                    { email }
                ]
            }
        })

        if(checkUserPresent) {
            return res.status(400).json({
                message: "User already exists with same userName OR email ",
            });
        }
        
        const user = await User.create({
            userName,
            firstName,
            lastName,
            email,
            password,
            phone,
            role
        })

        if(role == null){
            return res.status(400).json({
                message: "Please select role",
            });
        }

        // console.log('User created successfully : ', user);
        return res.status(200).json({
            message: "User created successfully",
            userData: user
        });
        
    } catch (error) {
        console.error('Unable to create user : ', error);
        return res.status(500).json({
            message: "Unable to create user",
            error: error.message
        });
    }
}


const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        if(!users){
            return res.status(404).json({
                message: "Users not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Users fetched successfully",
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while getting users",error: error.message});
    }
}

const updateUser = async ( req, res) => {
    const {fullName, lastName, userName, email, phone,role} = req.body;
    try {
        const {id} = req.params;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.update({
            fullName,
            lastName,
            userName,
            email,
            phone: phone || null,
            role
        });

        return res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: "Error updating user", error });
    }
};


const updatePassword = async (req,res) => {
const {newPassword, confirmPassword} = req.body;
const {id} = req.params;
try {
    
    if(!newPassword || !confirmPassword){
        return res.status(400).json({message: "All password fields are required"});
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({message: "Passwords do not match"});
    }
    
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = newPassword
    const passwordUpdated = await user.save(); 


    return res.status(200).json({ success: true, message: "Password updated successfully", passwordUpdated, confirmPassword });

} catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error while updating password",error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

const loginUser = async(req, res) => {
    try {
        const { userName, password } = req.body;

        if(!userName || !password){
            return res.status(400).json({
                message: "For login, all fields are required"
            })
        }

        const user = await User.findOne({
            where: {
                userName
            },
            include: [
                {
                    model: Role,
                    as: "userRole",
                    attributes: ["id", "roleName"]
                }
            ]
        })

        // console.log("USER",user);

        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const roleId = user.userRole ? user.userRole.id : null; 
        console.log("roleId",roleId);

        const isPasswordValid = await user.validatePassword(password);
        // console.log(isPasswordValid, password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                message: "Login password is incorrect",
                success: false
            })
        }
        const token = jwt.sign({
            userName,
            password,
            role: user.role,
            roleId
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7h"
        })

        return res.status(200).json({
            message: `${user.role} logged in successfully`,
            token,
            success: true
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while login user",
            error: error.message
        })
    }
}

const deleteUser = async (req, res)=> {
    try {

        const {id} = req.params;

        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        
        await user.destroy();
        return res.status(200).json({message: "User deleted successfully"});

    } catch (error) {
        return res.status(500).json({message: "Error while deleting user",error: error.message});
    }
}

export {
    getAllUserData,
    getUsers,
    updateUser,
    updatePassword,
    loginUser,
    deleteUser
}
