import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new ApiError(400, 'Only image files are allowed!'), false);
        }
    }
});

// Function to upload to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder = 'uploads') => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto:good' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(new ApiError(500, `Failed to upload image to Cloudinary: ${error.message}`));
                } else {
                    resolve(result);
                }
            }
        ).end(fileBuffer);
    });
};

// Middleware to handle single file upload
const uploadSingle = (fieldName, folder = 'uploads') => {
    return [
        upload.single(fieldName),
        asyncHandler(async (req, res, next) => {
            if (!req.file) {
                return next();
            }

            const result = await uploadToCloudinary(req.file.buffer, folder);

            req.cloudinaryResult = {
                public_id: result.public_id,
                secure_url: result.secure_url,
                url: result.url,
                format: result.format,
                width: result.width,
                height: result.height,
                bytes: result.bytes
            };

            next();
        })
    ];
};

// Middleware to handle multiple files upload
const uploadMultiple = (fieldName, maxCount = 5, folder = 'uploads') => {
    return [
        upload.array(fieldName, maxCount),
        asyncHandler(async (req, res, next) => {
            if (!req.files || req.files.length === 0) {
                return next();
            }

            // Upload all files to Cloudinary
            const uploadPromises = req.files.map(file =>
                uploadToCloudinary(file.buffer, folder)
            );

            const settledResults = await Promise.allSettled(uploadPromises);

            const successfulUploads = [];
            const failedUploads = [];

            settledResults.forEach((result, idx) => {
                if (result.status === 'fulfilled') {
                    successfulUploads.push(result.value);
                } else {
                    failedUploads.push({ index: idx, reason: result.reason });
                }
            });

            if (failedUploads.length > 0) {
                // Cleanup: delete any successful uploads
                await Promise.all(
                    successfulUploads.map(upload =>
                        deleteFromCloudinary(upload.public_id)
                    )
                );
                // Pass error to next middleware
                return next(new ApiError(500, 'One or more images failed to upload. All successful uploads have been cleaned up.'));
            }

            req.cloudinaryResults = successfulUploads.map(result => ({
                public_id: result.public_id,
                secure_url: result.secure_url,
                url: result.url,
                format: result.format,
                width: result.width,
                height: result.height,
                bytes: result.bytes
            }));

            next();
        })
    ];
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new ApiError(500, `Failed to delete image from Cloudinary: ${error.message}`);
    }
};

export {
    uploadSingle,
    uploadMultiple,
    uploadToCloudinary,
    deleteFromCloudinary,
    cloudinary
};
