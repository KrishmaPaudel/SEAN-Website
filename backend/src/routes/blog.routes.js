import { Router } from "express";
import { createBlog, getAllBlogs, updateBlog, deleteBlog } from "../controllers/blog.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(createBlog);
router.route("/filter").get(getAllBlogs);
router.route("/update/:id").put(authMiddleware, updateBlog);
router.route("/delete/:id").delete(authMiddleware, deleteBlog);

export default router;