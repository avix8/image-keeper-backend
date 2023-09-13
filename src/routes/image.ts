import { Router } from "express";
import * as imageController from "../controllers/image.controller.js";
import {
    validatePost,
    validateGet,
} from "../middlewares/validation.middleware.js";
import schemas from "../validation/image.validation.js";

const router = Router();

router.get("/getAll", imageController.getAll);
router.get("/file/:id", validateGet(schemas.id), imageController.download);

router.post(
    "/upload",
    imageController.upload.single("image"),
    imageController.uploaded,
);

router.post(
    "/setLabel",
    validatePost(schemas.setLabel),
    imageController.setLabel,
);

router.delete("/", validatePost(schemas.id), imageController.remove);

export default router;
