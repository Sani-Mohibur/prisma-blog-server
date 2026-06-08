import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/stats", auth(UserRole.ADMIN), postController.getStats);
router.get("/", postController.getAllPost);
router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getMyPosts,
);
router.get("/:id", postController.getPostById);
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost,
);
router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.updatePost,
);
router.delete(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.deletePost,
);
router.patch("/:id/read-time", postController.incrementReadTime);

export const postRouter = router;
