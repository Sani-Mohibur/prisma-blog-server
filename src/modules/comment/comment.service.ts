import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
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

// const deleteComment = async (commentId: string, authorId: string) => {
//   const commentData = await prisma.comment.findUnique({
//     where: {
//       id: commentId,
//     },
//     select: {
//       id: true,
//       content: true,
//       authorId: true,
//     },
//   });
//   if (!commentData) {
//     throw new Error("Comment not found!");
//   }

//   if (commentData.authorId !== authorId) {
//     throw new Error("You are not authorized to delete this comment");
//   }
//   console.log(commentData);

//   // return await prisma.comment.delete({
//   //   where: {
//   //     id: commentData.id,
//   //   },
//   // });
// };

const deleteComment = async (commentId: string, authorId: string) => {
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
  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  authorId: string
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

export const CommentService = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
};
