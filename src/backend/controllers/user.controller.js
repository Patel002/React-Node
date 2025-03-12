import {User} from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from 'bcrypt'

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

        console.log('User created successfully : ', user);
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

const getUser = async(req,res) => {
    const {userName, password} = req.body;
    
    if(!userName || !password) {
        return res.status(400).json({message: "All fields are required"});    
    }

    try {
        const user = await User.findOne({
            where: {
                userName 
            }
        })

        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const isPasswordValid = await user.validatePassword(password);
        // console.log(isPasswordValid);

        if(!isPasswordValid){
            return res.status(400).json({
                message: "You are Unauthorized to login",
                success: false
            })
        }

        const token = jwt.sign({
            userName,
            password,
            role: user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn: "7h"})

            console.log(token, user.role,user.userName);

        return res.status(200).json({
            message: `${user.role} logged in successfully`,
            token,
            success: true
        })

    } catch (error) {
        console.log("error while getting user", error);
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

const updateUser = async (req, res) => {
    const { id } = req.params;
    let updateFields = req.body;

    try {
        if (!id) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        updateFields = Object.fromEntries(
            Object.entries(updateFields).filter(([_, value]) => value !== null && value !== undefined)
        );

        if (Object.keys(updateFields).length === 0) {
            return res.status(200).json({
                message: "No changes made",
                success: true,
                user
            });
        }

        if (updateFields.password) {
            if (updateFields.password === user.password) {
                delete updateFields.password;
            } else {
                updateFields.password = await bcrypt.hash(updateFields.password, 8);
            }
        }

        if (updateFields.phone) {
            const phoneRegex = /^\+?\d{1,4}?[ -]?\d{10,15}$/;
            if (!phoneRegex.test(updateFields.phone)) {
                return res.status(400).json({
                    message: "Phone number must be valid (10-15 digits, optional country code)",
                    success: false
                });
            }
        }

        await user.update(updateFields, { validate: true });

        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error while updating user",
            error: error.message
        });
    }
};



export {
    getAllUserData,
    getUser,
    getUsers,
    updateUser
}
