import { Router } from "express";
import { AuthMiddleware } from "../auth/auth.middleware";
import { BlogController } from "./blog.controller";

const router = Router();

// Public Routes
router.get("/public", BlogController.getPublicBlogs);
router.get("/public/:slug", BlogController.getBlogBySlug);
router.get("/tags", BlogController.getTags);

// Admin Routes
router.use(AuthMiddleware.requireAuth());
router.get("/", BlogController.getAdminBlogs);
router.post("/", BlogController.createBlog);
router.patch("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);

router.post("/tags", BlogController.createTag);
router.delete("/tags/:id", BlogController.deleteTag);

export default router;
