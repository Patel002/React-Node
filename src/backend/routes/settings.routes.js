import { setSettings, getSettings, updateSettings } from "../controllers/settings.controller.js";
import { Router } from "express";

const router =  Router();

router.route("/set-settings").post(setSettings);
router.route("/get-settings").get(getSettings);
router.route("/update/:id").patch(updateSettings);

export default router;