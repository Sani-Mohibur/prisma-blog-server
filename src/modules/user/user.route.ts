import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/featured-authors", UserController.getFeaturedAuthors);
router.get("/:id", UserController.getAuthorById);

export const userRouter = router;
