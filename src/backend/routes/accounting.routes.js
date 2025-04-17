import { setAccounting, getAccounting, updateAccounting } from "../controllers/accounting.controller.js";
import { Router } from "express";

const router = Router();

router.route("/set-accounting").post(setAccounting);
router.route("/get-accounting").get(getAccounting);
router.route("/update-accounting/:id").patch(updateAccounting);

export default router;