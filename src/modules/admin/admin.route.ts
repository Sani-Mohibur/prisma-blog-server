import express from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middlewares/auth.middleware";

const router = express.Router();

// Middleware to restrict access to ADMIN and MODERATOR only
const adminAuth = auth(UserRole.ADMIN, UserRole.MODERATOR);

// DASHBOARD
router.get("/dashboard/stats", adminAuth, AdminController.getDashboardStats);

// USER MANAGEMENT
router.get("/users", adminAuth, AdminController.getAllUsers);
router.get("/users/:userId", adminAuth, AdminController.getUserById);
// updateUser is used for changing roles, suspending/activating, and toggling isFeatured.
// We apply adminAuth, but inside the controller/service we enforce specific role checks.
router.patch("/users/:userId", adminAuth, AdminController.updateUser);

// BLOG MANAGEMENT
router.get("/blogs", adminAuth, AdminController.getAllBlogs);
router.patch("/blogs/:blogId", adminAuth, AdminController.updateBlog);
router.delete("/blogs/:blogId", adminAuth, AdminController.deleteBlog);

// COMMENT MANAGEMENT
router.get("/comments", adminAuth, AdminController.getAllComments);
router.delete("/comments/:commentId", adminAuth, AdminController.deleteComment);

// CATEGORY MANAGEMENT
router.post("/categories", adminAuth, AdminController.createCategory);
router.get("/categories", adminAuth, AdminController.getAllCategories);
router.patch("/categories/:categoryId", adminAuth, AdminController.updateCategory);
router.delete("/categories/:categoryId", adminAuth, AdminController.deleteCategory);

// SETTINGS MANAGEMENT
// Both ADMIN and MODERATOR can view site settings, but only ADMIN can update site settings.
const strictlyAdminAuth = auth(UserRole.ADMIN);
router.get("/settings", adminAuth, AdminController.getSettings);
router.patch("/settings", strictlyAdminAuth, AdminController.updateSettings);

export const adminRouter = router;
