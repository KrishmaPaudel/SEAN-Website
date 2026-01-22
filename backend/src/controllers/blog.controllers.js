import { Blog } from "../models/blog.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary } from "../middlewares/cloudinary.middlewares.js";

const createBlog = asyncHandler(async (req, res) => {
  const { title, slug, content } = req.body;

  if (title == "") {
    throw new ApiError(400, "Title is required");
  }
  if (slug == "") {
    throw new ApiError(400, "Slug is required");
  }
  if (content == "") {
    throw new ApiError(400, "Content is required");
  }

  // Handle uploaded images
  const photos = [];
  if (req.cloudinaryResults && req.cloudinaryResults.length > 0) {
    photos.push(...req.cloudinaryResults.map(result => result.secure_url));
  }

  const blog = await Blog.create({
    title,
    slug,
    content,
    photos,
  });

  if (!blog) {
    throw new ApiError(500, "Error creating blog");
  }

  return res
    .status(201)
    .json(ApiResponse.data(201, blog, "blog created successfully"));
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

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, slug, content } = req.body;

  if (!id) {
    throw new ApiError(400, "Blog ID is required");
  }

  // Check if blog exists and if slug already exists (if being updated)
  const [existingBlog, slugExists] = await Promise.all([
    Blog.findById(id),
    slug ? Blog.findOne({ slug, _id: { $ne: id } }) : Promise.resolve(null),
  ]);

  if (!existingBlog) {
    throw new ApiError(404, "Blog not found");
  }

  if (slug && slugExists) {
    throw new ApiError(409, "A blog with this slug already exists");
  }

  // Prepare update object with only provided fields
  const updateFields = {};
  if (title !== undefined) {
    const trimmedTitle = title.trim();
    if (trimmedTitle === "") {
      throw new ApiError(400, "Title cannot be empty");
    }
    updateFields.title = trimmedTitle;
  }
  if (slug !== undefined) {
    const trimmedSlug = slug.trim();
    if (trimmedSlug === "") {
      throw new ApiError(400, "Slug cannot be empty");
    }
    updateFields.slug = trimmedSlug;
  }
  if (content !== undefined) {
    const trimmedContent = content.trim();
    if (trimmedContent === "") {
      throw new ApiError(400, "Content cannot be empty");
    }
    updateFields.content = trimmedContent;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(ApiResponse.data(200, updatedBlog, "Blog updated successfully"));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Blog ID is required");
  }

  // First find the blog to get the photos
  const blogToDelete = await Blog.findById(id);

  if (!blogToDelete) {
    throw new ApiError(404, "Blog not found");
  }

  // Delete all images from Cloudinary if they exist
  if (blogToDelete.photos && blogToDelete.photos.length > 0) {
    try {
      const deletePromises = blogToDelete.photos.map(async (photoUrl) => {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/public_id.ext
        const urlParts = photoUrl.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${publicIdWithExt.split('.')[0]}`;

        return await deleteFromCloudinary(publicId);
      });

      // Wait for all deletions to complete (or fail)
      await Promise.allSettled(deletePromises);
      console.log(`Attempted to delete ${blogToDelete.photos.length} images from Cloudinary`);
    } catch (error) {
      console.error('Error during Cloudinary cleanup:', error);
    }
  }

  await Blog.findByIdAndDelete(id);

  return res
    .status(200)
    .json(ApiResponse.message(200, "Blog and associated images deleted successfully"));
});

export { createBlog, getAllBlogs, updateBlog, deleteBlog };
