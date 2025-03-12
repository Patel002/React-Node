import { Router } from "express";
import { addRole, getRole, updateRole } from "../controllers/role.controller.js";

const router = Router();

router.route("/add-role").post(addRole);
router.route("/list-role").get(getRole);
router.route("/update-role").patch(updateRole);

export default router;