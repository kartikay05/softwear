import multer from "multer";
import ApiError from "../utils/apiError.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5,
    },
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new ApiError(400, "Only image files are allowed"));
        }

        cb(null, true);
    },
});

export const uploadProductImages = upload.array("images", 5);
