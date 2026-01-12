import multer from 'multer';
import path from 'path';
import fs from 'fs';

// في Vercel، لا يمكننا الكتابة على القرص، لذا سنستخدم الذاكرة
const isVercel = process.env.VERCEL === '1';

let storage;

if (isVercel) {
    // استخدام تخزين الذاكرة في Vercel
    storage = multer.memoryStorage();
    console.log('📡 Multer: Using Memory Storage for Vercel');
} else {
    // استخدام القرص محلياً أو في Render
    const uploadDir = 'public/uploads/';
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (error) {
        console.warn('⚠️ Could not create upload directory:', error.message);
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        }
    });
    console.log('📡 Multer: Using Disk Storage');
}

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp)!'));
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

export default upload;
