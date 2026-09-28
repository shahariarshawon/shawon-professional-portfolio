import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";

type TAnyObject = Record<string, any>;

export const getAdminBlogs = async () => {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } } }
  });
};

export const getPublicBlogs = async () => {
  return prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: { tags: { include: { tag: true } } }
  });
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { tags: { include: { tag: true } } }
  });

  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  return blog;
};

export const createBlog = async (payload: TAnyObject) => {
  const { tags, ...blogData } = payload;

  return prisma.blog.create({
    data: {
      ...(blogData as any),
      tags: {
        create: (tags || []).map((tagId: string) => ({
          tag: { connect: { id: tagId } }
        }))
      }
    },
    include: { tags: { include: { tag: true } } }
  });
};

export const updateBlog = async (id: string, payload: TAnyObject) => {
  const { tags, ...blogData } = payload;

  const existingBlog = await prisma.blog.findUnique({ where: { id } });
  if (!existingBlog) throw new AppError(404, "Blog not found");

  if (tags !== undefined) {
    await prisma.blogTag.deleteMany({ where: { blogId: id } });
  }

  return prisma.blog.update({
    where: { id },
    data: {
      ...(blogData as any),
      ...(tags !== undefined && {
        tags: {
          create: tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        }
      })
    },
    include: { tags: { include: { tag: true } } }
  });
};

export const deleteBlog = async (id: string) => {
  const existingBlog = await prisma.blog.findUnique({ where: { id } });
  if (!existingBlog) throw new AppError(404, "Blog not found");

  return prisma.blog.delete({ where: { id } });
};

// Tag Management
export const getTags = async () => {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
};

export const createTag = async (payload: TAnyObject) => {
  return prisma.tag.create({ data: payload as any });
};

export const deleteTag = async (id: string) => {
  return prisma.tag.delete({ where: { id } });
};

export const BlogService = {
  getAdminBlogs,
  getPublicBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getTags,
  createTag,
  deleteTag
};
