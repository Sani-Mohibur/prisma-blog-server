import express, { Application } from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import morgan from "morgan";

const app: Application = express();
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true, // authenticate users with cookies or tokens
  })
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("API is working!");
});
export default app;
