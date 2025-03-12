import { Router } from "express";
import { superAdminRegister, loginSuperAdmin } from "../controllers/superadmin.controller.js";

const router = Router();

router.route("/admin-register").post(superAdminRegister);
router.route("/admin-login").post(loginSuperAdmin);

export default router;