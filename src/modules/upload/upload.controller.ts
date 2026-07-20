import { Request, Response } from "express";

const uploadImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const imageUrls = files.map((file) => file.path);

    res.status(200).json({
      status: "Success",
      data: imageUrls,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
};

export const uploadController = {
  uploadImages,
};
