import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogService } from "./blog.service";
import AppError from "../../errors/AppError";

const getIdFromParams = (req: Request): string => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id) throw new AppError(400, "Id is required");
  return id as string;
};

const getAdminBlogs = catchAsync(async (_req: Request, res: Response) => {
  const result = await BlogService.getAdminBlogs();
  sendResponse(res, { success: true, statusCode: 200, message: "Blogs fetched successfully", data: result });
});

const getPublicBlogs = catchAsync(async (_req: Request, res: Response) => {
  const result = await BlogService.getPublicBlogs();
  sendResponse(res, { success: true, statusCode: 200, message: "Public blogs fetched successfully", data: result });
});

const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const result = await BlogService.getBlogBySlug(slug as string);
  sendResponse(res, { success: true, statusCode: 200, message: "Blog fetched successfully", data: result });
});

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.createBlog(req.body);
  sendResponse(res, { success: true, statusCode: 201, message: "Blog created successfully", data: result });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.updateBlog(getIdFromParams(req), req.body);
  sendResponse(res, { success: true, statusCode: 200, message: "Blog updated successfully", data: result });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.deleteBlog(getIdFromParams(req));
  sendResponse(res, { success: true, statusCode: 200, message: "Blog deleted successfully", data: result });
});

const getTags = catchAsync(async (_req: Request, res: Response) => {
  const result = await BlogService.getTags();
  sendResponse(res, { success: true, statusCode: 200, message: "Tags fetched successfully", data: result });
});

const createTag = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.createTag(req.body);
  sendResponse(res, { success: true, statusCode: 201, message: "Tag created successfully", data: result });
});

const deleteTag = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.deleteTag(getIdFromParams(req));
  sendResponse(res, { success: true, statusCode: 200, message: "Tag deleted successfully", data: result });
});

export const BlogController = {
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
