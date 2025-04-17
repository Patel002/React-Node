import { getInfo, getAllInfo, updateInfo,updateLogo, getLogo } from "../controllers/info.controller.js"
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express"

const router = Router();

router.route("/c-info").post(upload.fields([
    {
        name: 'logo',
        maxCount: 1
    }
]),getInfo)


router.route("/info").get(getAllInfo);
router.route("/update/:id").patch(updateInfo);
router.route("/update-logo/:id").patch(upload.single('logo'),updateLogo);
router.route("/Logo/:id").get(getLogo)

export default router;