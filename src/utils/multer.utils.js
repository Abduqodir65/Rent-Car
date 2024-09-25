import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExt = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + fileExt);
    },
});

export const upload = multer({ storage: storage });