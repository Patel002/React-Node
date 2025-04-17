import { Account } from "../model/glCode.model.js";

const setGlCode = async(req, res) => {
    const {code} = req.body;
    try {

        if(!code){
            return res.status(400).json({message: "Account code is required"});
        }

        const existingCode = await Account.findOne({where: {code}});
        if(existingCode){
            return res.status(400).json({message: "Account code already exists"});
        }

        const account = await Account.create({code});

        return res.status(200).json({message: "Account created successfully", account});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while creating account", error: error.message});
    }
}

const getGlCode = async(req, res) => {
    try {

        const account = await Account.findAll();

        if(!account){
            return res.status(400).json({message: "Account not found"});
        }

        return res.status(200).json({message: "Account fetched successfully", account});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while getting account", error: error.message});
    }
}

export {
    setGlCode,
    getGlCode
}