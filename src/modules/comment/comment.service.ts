import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  authorName: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentsByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: { title: true },
      },
    },
  });
};

const deleteComment = async (commentId: string, authorId: string, isAdmin?: boolean) => {
  const commentData = await prisma.comment.findFirst({
    where: isAdmin ? { id: commentId } : {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
      content: true,
    },
  });
  if (!commentData) {
    throw new Error("Comment not found!");
  }
  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  authorId: string,
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
      content: true,
    },
  });
  if (!commentData) {
    throw new Error("Comment not found!");
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentData.status === data.status) {
    throw new Error(`This comment is already ${data.status}`);
  }

  return await prisma.comment.update({
    where: {
      id,
    },
    data,
  });
};

const getAllComments = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const data = await prisma.comment.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        select: { title: true }
      }
    }
  });
  const total = await prisma.comment.count();
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

export const CommentService = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
  getAllComments,
};
