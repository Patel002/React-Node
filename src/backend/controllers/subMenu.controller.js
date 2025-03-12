import { SubMenu } from '../model/subMenu.model.js';

const createSubMenu = async(req, res) => {
    try {
        const { mainMenu, subMenuName, url, active } = req.body;

        if(!mainMenu || !subMenuName || !url) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existingSubMenu = await SubMenu.findOne({
            where: {
                mainMenu,
                subMenuName
            }
        })

        if(existingSubMenu) {
            return res.status(400).json({
                message: "SubMenu already exists"
            })
        }

        const subMenu = await SubMenu.create({
            mainMenu,
            subMenuName,
            url,
            active
        })

        return res.status(201).json({
            message: "SubMenu created successfully",
            subMenu
        })

    } catch (error) {
        return res.status(500).json({
            error,
            message: "Error while creating subMenu"
        })
    }
}

const getSubMenu = async(req, res) => {
    try {
        const subMenu = await SubMenu.findAll();

        if(subMenu.length === 0) {
            return res.status(400).json({
                message: "No subMenu found"
            })
        }
        return res.status(200).json({
            message: "SubMenu fetched successfully",
            subMenu
        })
    } catch (error) {
        return res.status(500).json({
            error,
            message: "Error while getting subMenu"
        })
    }
}

const updateMenu =  async(req, res) => {
    const{ id } = req.params;
    const updateFields = req.body;

    try {
        const menu = await SubMenu.findByPk(id);

        if(!menu){
            return res.status(400).json({
                message: "SubMenu not found"
            })                                
        }

        const updates = {};

        Object.keys(req.body).forEach(key => {
            if(updateFields[key] !== null){
                updates[key] = updateFields[key];
            }
        });

        if(Object.keys(updateFields).length === 0){
            return res.status(400).json({
                message: "No valid fields provided for update"
            })
        }

        const update = await menu.update(updates, {
            where: { id }
        });

        return res.status(200).json({
            message: "SubMenu updated successfully",
            update
        });

    } catch (error) {
        console.log("This error comes from updating subMenu");
        return res.status(500).json({
            error,
            message: "Error while updating subMenu"
        })
    }
}

const deleteMenu = async(req, res) => {
    const { id } = req.params;

    try {
        const menu = await SubMenu.findByPk(id);

        if(!menu){
            return res.status(400).json({
                message: "SubMenu not found"
            })
        }
     const deletedMenu = await menu.destroy();

     return res.status(200).json({
        message: "SubMenu deleted successfully",
        deletedMenu
     }) 

    } catch (error) {
        console.log("this error comes from deleting subMenu");
        return res.status(500).json({
            error,
            message: "Error while deleting subMenu"
        })
    }
}

export { 
    createSubMenu,
    getSubMenu,
    updateMenu,
    deleteMenu
 }