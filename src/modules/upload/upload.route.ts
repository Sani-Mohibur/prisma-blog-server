import express from "express";
import { uploadController } from "./upload.controller";
import auth, { UserRole } from "../../middlewares/auth.middleware";
import { upload } from "../../lib/cloudinary";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  upload.array("images", 10),
  uploadController.uploadImages
);

export const uploadRouter = router;
