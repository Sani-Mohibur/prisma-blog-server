import { prisma } from "../../lib/prisma";

const getFeaturedAuthors = async () => {
  const authors = await prisma.user.findMany({
    where: {
      isFeatured: true,
      status: "ACTIVE", // Optional but good practice
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
    },
    take: 6, // Fetch up to 6 featured authors
  });

  // Since there is no explicit Prisma relation between User and Post,
  // we manually fetch the post counts for these authors.
  const authorIds = authors.map(a => a.id);
  const postCounts = await prisma.post.groupBy({
    by: ['authorId'],
    where: {
      authorId: { in: authorIds },
      status: 'PUBLISHED'
    },
    _count: {
      _all: true
    }
  });

  // Map counts back to authors
  const authorsWithCounts = authors.map(author => {
    const countData = postCounts.find(pc => pc.authorId === author.id);
    return {
      ...author,
      _count: {
        posts: countData ? countData._count._all : 0
      }
    };
  });

  return authorsWithCounts;
};

const getAuthorById = async (id: string) => {
  const author = await prisma.user.findUnique({
    where: {
      id,
      status: "ACTIVE", // Only active users can be viewed publicly
    },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true, // Join date
    }
  });

  if (!author) {
    throw new Error("Author not found");
  }

  // Count published posts
  const postCount = await prisma.post.count({
    where: {
      authorId: id,
      status: 'PUBLISHED'
    }
  });

  return {
    ...author,
    _count: {
      posts: postCount
    }
  };
};

export const UserService = {
  getFeaturedAuthors,
  getAuthorById,
};
