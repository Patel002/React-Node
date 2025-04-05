    import { Role } from "../model/roles.model.js";

    const addRole = async (req, res) => {
        try {
            const { roleName } = req.body;

            if(!roleName) {
                return res.status(400).json({message: "role field are required"});
            }

            const existingRole = await Role.findOne({where: {roleName}});

            if(existingRole){
                return res.status(400).json({message: "Role already exists"});
            }

            if(roleName === "Super Admin" || roleName === "super Admin" || roleName === 'super admin' || roleName === 'superadmin' || roleName === 'SuperAdmin' || roleName === 'superAdmin' || roleName === 'Superadmin') {
                return res.status(400).json({message: "Super Admin role cannot be added"});
            }

            const role = await Role.create({roleName});

            console.log("role",role);
            return res.status(201).json({message: "Role added successfully", role});

        } catch (error) {
            return res.status(400).json({message: " Error while adding role"});
        }
    }

    const getRole = async(req, res) => {
        try {
            const roles = await Role.findAll();

            if(roles.length === 0) {
                return res.status(400).json({message: "No roles found"});
            }

            return res.status(200).json({message: "Roles fetched successfully", roles});

        } catch (error) {
            return res.status(500).json({
                message: "error while getting roles from database"
            })
        }
    }

    const updateRole = async(req, res) => {
        const{id} = req.query;

        try {

            if(!id) {
                return res.status(400).json({message: "Role id is required"});
            }

            const role = await Role.findByPk(id);

            if(!role) {
                return res.status(400).json({message: "Role not found"});
            }

            const {roleName} = req.body;

            if(!roleName) {
                return res.status(400).json({message: "Role name is required"});
            }

            const update = await role.update({roleName});

            return res.status(200).json({message: "Role updated successfully", update});
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Error while updating role",message: error.message});
        }
    }

    const deleteRole = async (req, res)=> {
        try {
    
            const {id} = req.params;
    
            const role = await Role.findByPk(id);
            if(!role){
                return res.status(404).json({message: "role not found"});
            }
            
            await role.destroy();
            return res.status(200).json({message: "role deleted successfully",role});
    
        } catch (error) {
            return res.status(500).json({message: "Error while deleting role",error: error.message});
        }
    }
    

export {addRole, getRole, updateRole, deleteRole};