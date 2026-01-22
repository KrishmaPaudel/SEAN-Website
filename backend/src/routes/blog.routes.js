import { Router } from "express";
import { createBlog, getAllBlogs, updateBlog, deleteBlog } from "../controllers/blog.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { uploadMultiple } from "../middlewares/cloudinary.middlewares.js";

const router = Router();

router.route("/").post(authMiddleware, uploadMultiple('photos', 5, 'blogs'), createBlog);
router.route("/filter").get(getAllBlogs);
router.route("/:id").put(authMiddleware, uploadMultiple('photos', 5, 'blogs'), updateBlog);
router.route("/:id").delete(authMiddleware, deleteBlog);

export default router;