import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { postService } from "../post/post.service";
import { CommentService } from "../comment/comment.service";
import { UserRole } from "../../middlewares/auth.middleware";

// DASHBOARD

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await postService.getStats();
    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// USER MANAGEMENT

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const status = req.query.status as string;

    const users = await AdminService.getAllUsers(page, limit, search, role, status);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await AdminService.getUserById(req.params.userId as string);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role as UserRole;
    const updatedUser = await AdminService.updateUser(req.params.userId as string, req.body, role);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// BLOG MANAGEMENT

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // We pass isAdmin = true to bypass private blog filter
    const blogs = await postService.getAllPost({
      ...req.query,
      page,
      limit,
      skip,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      tags: req.query.tags ? (req.query.tags as string).split(",") : [],
    } as any, true);

    res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: blogs
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    // Admin bypasses author checks
    const updatedBlog = await postService.updatePost(
      req.params.blogId as string,
      req.body,
      req.user?.id as string,
      true
    );
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    // Admin bypasses author checks
    await postService.deletePost(req.params.blogId as string, req.user?.id as string, true);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// COMMENT MANAGEMENT

const getAllComments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const comments = await CommentService.getAllComments(page, limit);
    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    await CommentService.deleteComment(req.params.commentId as string, req.user?.id as string, true);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CATEGORY MANAGEMENT

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await AdminService.createCategory(req.body.name);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await AdminService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await AdminService.updateCategory(req.params.categoryId as string, req.body.name);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    await AdminService.deleteCategory(req.params.categoryId as string);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SETTINGS MANAGEMENT

const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await AdminService.getSettings();
    res.status(200).json({
      success: true,
      message: "Settings retrieved successfully",
      data: settings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await AdminService.updateSettings(req.body);
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const AdminController = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getAllComments,
  deleteComment,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getSettings,
  updateSettings
};
