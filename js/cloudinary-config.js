// js/cloudinary-config.js

// 1. Your Cloudinary Cloud Name (from your Dashboard)
const cloudName = "lpkbeyum"; // e.g., "d5x3y7z"

// 2. The unsigned upload preset you just created
const uploadPreset = "umyu_scholar_preset"; 

// 3. The direct upload URL (we keep this here so we don't type it everywhere)
const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

// 4. EXPORT these so the upload.js file can use them
export { cloudName, uploadPreset, cloudinaryUploadUrl };