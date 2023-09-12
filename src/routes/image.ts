import { Router } from "express";
import * as imageController from "../controllers/image.controller.js";
const router = Router();

router.post(
    "/upload",
    imageController.upload.single("image"),
    imageController.uploaded,
);
router.get("/getAll", imageController.getAll);
router.get("/file/:id", imageController.download);

export default router;
