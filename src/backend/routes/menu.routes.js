import { Router } from "express";
import { createMenu, getMenuList, updateMenu, deleteMenu, getParents } from "../controllers/menu.controller.js";

const router = Router();

router.route("/create-menu").post(createMenu);
router.route("/list-menu").get(getMenuList);
router.route("/update-menu/:id").patch(updateMenu);
router.route("/delete-menu/:id").delete(deleteMenu);
router.route("/get-parents").get(getParents);

export default router;