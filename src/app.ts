import express, { Application } from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import morgan from "morgan";
import { commentRouter } from "./modules/comment/comment.route";
import { adminRouter } from "./modules/admin/admin.route";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

const app: Application = express();
app.set("trust proxy", true);
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true, // authenticate users with cookies or tokens
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());

import { uploadRouter } from "./modules/upload/upload.route";
import { userRouter } from "./modules/user/user.route";

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/upload", uploadRouter);
app.use("/admin", adminRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("API is working!");
});
app.use(notFound);
app.use(errorHandler);

export default app;
