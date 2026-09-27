const multer = require("multer");

// In-memory storage - files never touch disk. Good enough for an MVP;
// swap to disk/S3 storage for production-scale uploads.
const storage = multer.memoryStorage();

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ALLOWED_DATA_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function fileFilterFactory(allowedTypes) {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  };
}

const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilterFactory(ALLOWED_IMAGE_TYPES),
});

const dataUpload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: fileFilterFactory(ALLOWED_DATA_TYPES),
});

const docUpload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

module.exports = { imageUpload, dataUpload, docUpload };
