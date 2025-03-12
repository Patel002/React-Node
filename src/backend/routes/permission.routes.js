import { Router } from "express";
import { addPermission,getPermissionList, getAllMenuPermissions, getSidebarMenuByRole } from "../controllers/permission.controller.js";
 
const router = Router();

router.route("/add-permission").post(addPermission);
router.route("/list-permission").get(getPermissionList);
router.route("/all-menu-permissions").get(getAllMenuPermissions);
router.route("/list").get(getSidebarMenuByRole)

export default router;