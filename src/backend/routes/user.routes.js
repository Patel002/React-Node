import { Router } from "express";
import { getAllUserData,getUser,updateUser, getUsers } from "../controllers/user.controller.js";
import { isSuperAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(isSuperAdmin, getAllUserData);
router.route("/login").post(getUser);
router.route("/list-users").get(isSuperAdmin, getUsers);
router.route("/update-user/:id").patch(isSuperAdmin, updateUser);

export default router;