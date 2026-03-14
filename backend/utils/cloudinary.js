import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (path) => {
  try {
    const result = await cloudinary.v2.uploader.upload(path, {
      folder: 'clean-tourist',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed');
  }
};
