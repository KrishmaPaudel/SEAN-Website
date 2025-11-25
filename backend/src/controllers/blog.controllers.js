import { Blog } from "../models/blog.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBlog = asyncHandler(async (req, res) => {
  const { title, slug, content } = req.body;
  if (title == "") {
    return new ApiError(400, "Title is required");
  }
  if (slug == "") {
    return new ApiError(400, "Slug is required");
  }
  if (content == "") {
    return new ApiError(400, "Content is required");
  }
  const blog = await Blog.create({
    title,
    slug,
    content,
  });
  if (!blog) {
    throw new ApiError(500, "Error creating blog");
  }
  return res
    .status(201)
    .json(ApiResponse.data(200, blog, "blog created successfully"));
});

const getAllBlogs = asyncHandler(async (req, res) => {
  // Extract pagination parameters from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const [blogs, totalBlogs] = await Promise.all([
    Blog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(),
  ]);

  const hasNext = page * limit < totalBlogs;

  return res
    .status(200)
    .json(
      ApiResponse.pagination(
        200,
        blogs,
        totalBlogs,
        hasNext,
        "blogs fetched successfully"
      )
    );
});

export { createBlog, getAllBlogs };
