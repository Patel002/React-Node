import{
    setTerms,
    getTerms,
    updateTerms
} from "../controllers/terms.controller.js";
import { Router } from "express";

const router = Router();

router.route("/set-terms").post(setTerms);
router.route("/get-terms").get(getTerms);
router.route("/update-terms/:id").patch(updateTerms);

export default router;