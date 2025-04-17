import { setGlCode, getGlCode } from "../controllers/glCode.controller.js";
import { Router } from "express";

const router = Router();

router.route("/set-gl-code").post(setGlCode);       
router.route("/get-gl-code").get(getGlCode);

export default router;