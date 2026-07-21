import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth.middleware";

// USER MANAGEMENT

const getAllUsers = async (page: number, limit: number, search?: string, role?: string, status?: string) => {
  const skip = (page - 1) * limit;
  const whereCondition: any = {};
  
  if (search) {
    whereCondition.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  
  if (role) {
    whereCondition.role = role;
  }
  
  if (status) {
    whereCondition.status = status;
  }

  const data = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  const total = await prisma.user.count({ where: whereCondition });

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getUserById = async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
  });
};

const updateUser = async (
  id: string,
  data: { role?: string; status?: string; isFeatured?: boolean },
  requesterRole: string
) => {
  // Check if role is being changed. Moderator cannot change roles.
  if (data.role && requesterRole !== UserRole.ADMIN) {
    throw new Error("Only Administrators can change user roles.");
  }
  
  // If attempting to delete/suspend another admin or moderator, ensure proper rights.
  // We'll enforce this check.
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  
  if (data.status === "SUSPENDED" && requesterRole !== UserRole.ADMIN && (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR)) {
    throw new Error("Moderators cannot suspend other moderators or administrators.");
  }

  if (data.isFeatured) {
    const featuredCount = await prisma.user.count({
      where: { isFeatured: true, id: { not: id } }
    });
    if (featuredCount >= 6) {
      throw new Error("Maximum of 6 featured authors allowed.");
    }
  }

  return await prisma.user.update({
    where: { id },
    data
  });
};

// CATEGORY MANAGEMENT

const createCategory = async (name: string) => {
  return await prisma.category.create({
    data: { name }
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

const updateCategory = async (id: string, name: string) => {
  return await prisma.category.update({
    where: { id },
    data: { name }
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id }
  });
};

// SETTINGS MANAGEMENT

const getSettings = async () => {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" }
  });
  
  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: "default" }
    });
  }
  
  return settings;
};

const updateSettings = async (data: { siteName?: string; description?: string; logo?: string }) => {
  return await prisma.settings.update({
    where: { id: "default" },
    data
  });
};

export const AdminService = {
  getAllUsers,
  getUserById,
  updateUser,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getSettings,
  updateSettings
};
