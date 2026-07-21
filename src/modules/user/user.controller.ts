import { Request, Response } from "express";
import { UserService } from "./user.service";

const getFeaturedAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await UserService.getFeaturedAuthors();
    res.status(200).json({
      success: true,
      message: "Featured authors retrieved successfully",
      data: authors,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author = await UserService.getAuthorById(id as string);
    res.status(200).json({
      success: true,
      message: "Author retrieved successfully",
      data: author,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const UserController = {
  getFeaturedAuthors,
  getAuthorById,
};
