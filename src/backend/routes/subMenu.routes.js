import { Router } from "express";
import { createSubMenu, getSubMenu, updateMenu, deleteMenu} from "../controllers/subMenu.controller.js"

const router = Router();

router.route("/create-sub-menu").post(createSubMenu);
router.route("/list-sub-menu").get(getSubMenu);
router.route("/update-sub-menu/:id").patch(updateMenu);
router.route("/delete-sub-menu/:id").delete(deleteMenu);

export default router;