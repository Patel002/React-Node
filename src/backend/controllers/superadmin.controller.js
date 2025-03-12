import{ User } from "../model/user.model.js";
import jwt from "jsonwebtoken";

const superAdminRegister = async (req, res) => {
    try {
        const{ userName, firstName, lastName, email, password,role} = req.body;

        let { phone } = req.body;

        if(!userName || !firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingSuperAdmin = await User.findOne({
            where: { userName, role: "Super Admin" },
        });

        if(existingSuperAdmin){
            return res.status(400).json({message: "Super Admin already exists"});
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

        return res.status(201).json({
            message: "Super Admin registered successfully",
            user,
        });


    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Something went wrong While registering superAdmin"});
    }
}

const loginSuperAdmin = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if(!userName || !password) {
            return res.status(400).json({message: "All fields are required fro login into superAdmin"});
        }

        const user = await User.findOne({
            where: { userName, role: "Super Admin" },
        });

        if(!user) {
            return res.status(404).json({message: "Super Admin not found"});
        }

        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid) {
            return res.status(400).json({message: "Entered password is incorrect"});
        }

        const token = jwt.sign({
            id: user.id,
            userName: user.userName,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d"
        });

        console.log("login token superadmin///:=",token)

        return res.status(200).json({
            message: "Super Admin logged in successfully",
            token,
            user
        });
        
    } catch (error) {
        console.log("superAdmin login error",error);
        return res.status(400).json({
            message: "Error while login superAdmin"
        })
    }
}

export { 
    superAdminRegister,
    loginSuperAdmin
}