import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
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
    try {
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
                        reject(new ApiError(500, 'Failed to upload image to Cloudinary'));
                    } else {
                        resolve(result);
                    }
                }
            ).end(fileBuffer);
        });
    } catch (error) {
        throw new ApiError(500, 'Error uploading to Cloudinary');
    }
};

// Middleware to handle single file upload
const uploadSingle = (fieldName, folder = 'uploads') => {
    return [
        upload.single(fieldName),
        async (req, res, next) => {
            try {
                if (!req.file) {
                    return next();
                }

                // Upload to Cloudinary
                const result = await uploadToCloudinary(req.file.buffer, folder);

                // Add Cloudinary result to request object
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
            } catch (error) {
                next(error);
            }
        }
    ];
};

// Middleware to handle multiple files upload
const uploadMultiple = (fieldName, maxCount = 5, folder = 'uploads') => {
    return [
        upload.array(fieldName, maxCount),
        async (req, res, next) => {
            try {
                if (!req.files || req.files.length === 0) {
                    return next();
                }

                // Upload all files to Cloudinary
                const uploadPromises = req.files.map(file =>
                    uploadToCloudinary(file.buffer, folder)
                );

                const results = await Promise.all(uploadPromises);

                // Add Cloudinary results to request object
                req.cloudinaryResults = results.map(result => ({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                    url: result.url,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes
                }));

                next();
            } catch (error) {
                next(error);
            }
        }
    ];
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new ApiError(500, 'Failed to delete image from Cloudinary');
    }
};

export {
    uploadSingle,
    uploadMultiple,
    uploadToCloudinary,
    deleteFromCloudinary,
    cloudinary
};
