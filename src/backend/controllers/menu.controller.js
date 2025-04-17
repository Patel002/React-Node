import { Menu } from '../model/menu.model.js';

const createMenu = async (req, res) => {
    try {
        const { menuName, url, icon, parent, active, sequence } = req.body;

        if (!menuName || !url || !icon) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingMenu = await Menu.findOne({ where: { menuName } });

        if (existingMenu) {
            return res.status(400).json({ message: "Menu already exists" });
        }

        const menu = await Menu.create({ 
            menuName, 
            url, 
            icon, 
            parent: parent ? parent : null, 
            active, 
            sequence
         });

        return res.status(201).json({ message: "Menu created successfully", menu });

    } catch (error) {
        console.error("Error while creating menu:", error);
        return res.status(500).json({ message: "Error while creating menu" });
    }
};
 

const getMenuList = async(req, res) => {
    try {
        
        const menu = await Menu.findAll({
            order: [['sequence', 'ASC']]
        });

        return res.status(200).json({message: "Menu list fetched successfully", menu});
        
    } catch (error) {
        return res.status(500).json({message: "Error while getting menu list", error});
    }
}

const updateMenu = async(req, res) => {
    const {id} = req.params;
    const updateFields = req.body;

    try {

        const menu = await Menu.findByPk(id);
        if(!menu) {
            return res.status(404).json({message: "Menu not found"});
        }

        // if (active && !["ACTIVE", "INACTIVE"].includes(active.toUpperCase())) {
        //     return res.status(400).json({ message: "Invalid active status. Use 'ACTIVE' or 'INACTIVE'." });
        // }

        const updates = {};

        Object.keys(updateFields).forEach(key => {
            if (updateFields[key] !== null) {
                updates[key] = updateFields[key];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        const update = await menu.update(updates, {
            where: { id }
        });

        return res.status(200).json({message: "Menu updated successfully", update});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error while updating menu", error});
    }
}


const deleteMenu = async(req, res) => {
    const {id} = req.params;
    
    try {
        const menu = await Menu.findByPk(id);
        if(!menu) {
            return res.status(404).json({message: "Requested Menu not found"});
        }

        const deleted = await menu.destroy();
        
        return res.status(201).json({message: "Menu deleted successfully", deleted});

    } catch (error) {
        return res.status(500).json({message: "Error while deleting menu"});
    }
}

const getParents = async(req, res) => {
    try {

        const menu = await Menu.findAll({
            attributes: ['parent'],
            group: ['parent'],
        });

        return res.status(200).json({message: "Parents fetched successfully", menu});
        
    } catch (error) {
        return res.status(500).json({message: "Error while getting parents", error: error.message});
    }
}

export { createMenu, getMenuList, updateMenu, deleteMenu,getParents }