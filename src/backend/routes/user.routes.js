import { Router } from "express";
import { getAllUserData,updateUser, getUsers, updatePassword, loginUser, deleteUser, userProfile } from "../controllers/user.controller.js";
import { isSuperAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(isSuperAdmin, getAllUserData);
router.route("/list-users").get(isSuperAdmin, getUsers);
router.route("/update-user/:id").patch(isSuperAdmin, updateUser);
router.route("/update-password/:id").patch(isSuperAdmin, updatePassword);
router.route("/login-user").post(loginUser);
router.route("/delete-user/:id").delete(isSuperAdmin, deleteUser);
router.route("/user-profile/:id").get(userProfile);   

export default router;