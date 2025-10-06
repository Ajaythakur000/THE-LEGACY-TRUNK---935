const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary ko configure karna
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer ke liye Cloudinary storage engine set karna
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'legacy_trunk_stories', // Cloudinary mein is folder ke andar images save hongi
       allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'mp3'],
    },
});

// Multer middleware ko initialize karna
const upload = multer({ storage: storage });

module.exports = upload;