import { Router } from "express";
import { getAllUserData,updateUser, getUsers, updatePassword, loginUser } from "../controllers/user.controller.js";
import { isSuperAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(isSuperAdmin, getAllUserData);
router.route("/list-users").get(isSuperAdmin, getUsers);
router.route("/update-user/:id").patch(isSuperAdmin, updateUser);
router.route("/update-password/:id").patch(isSuperAdmin, updatePassword);
router.route("/login-user").post(loginUser);

export default router;