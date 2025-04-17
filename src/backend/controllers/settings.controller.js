import { Settings } from "../model/settings.model.js";

const setSettings = async(req, res) => {
    try {
        const{title} = req.body

        const existingSettings = await Settings.findOne({
            where: {
                title
            }
        })

        if(existingSettings){
            return res.status(400).json({
                message: "this title already registerd"
            })
        }

        const settings = await Settings.create({
            title
        });

        if(!settings){
            return res.status(400).json({
                message: "Error while submit title"
            })
        }

        return res.status(201).json({
            message: "Title created successfully",
            data: settings
        })

    } catch (error) {
        console.log("settins error",error);
        return res.status(500).json({
            message:error.message,
        })
    }
}

const getSettings = async(req,res) => {
    try {
        const setting = await Settings.findOne();

        if(!setting){
            return res.status(500).json({
                message: 'settings is not present'
            })
        }

        return res.status(200).json({
            success:true,
            data: setting
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
}

const updateSettings = async(req,res) => {
    try {
        const{id} = req.params
        const{title} = req.body

        const updateSettings = await Settings.findByPk(id);

        if(!updateSettings){
            return res.status(500).json({
                message: 'settings is not present fro update'
            })
        }

       const updated =  await updateSettings.update({
            title
        })

        return res.status(200).json({
            message: "update successfully",
            data:updated
        })


    } catch (error) {
        console.log("Update error in settings",error)
        return res.status(400).json({
            success:false,
            message:error
        })
    }
}

export {
    setSettings,
    getSettings,
    updateSettings
}