import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Helper function for automatic translation
const translateToArabic = async (text) => {
    try {
        if (!text || text.trim() === '') return '';

        const encodedText = encodeURIComponent(text);
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=fr|ar`
        );

        if (!response.ok) {
            console.warn('Translation API failed, returning original text');
            return '';
        }

        const data = await response.json();
        return data.responseData?.translatedText || '';
    } catch (error) {
        console.error('Translation error:', error);
        return '';
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            const categoryObj = await Category.findOne({ name: category });
            if (categoryObj) {
                query.category = categoryObj._id;
            }
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).populate('category', 'name');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ featured: true, isAvailable: true })
            .populate('category', 'name')
            .sort('-createdAt')
            .limit(6);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        console.log('\n\n========== إنشاء منتج جديد ==========');
        console.log('الوقت:', new Date().toLocaleString());
        console.log('المستخدم:', req.user?.email || 'غير محدد');
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        console.log('req.headers:', req.headers);

        const { name, description, price, category, stock, isAvailable, name_ar, description_ar } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate Category ID
        if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Category ID format'
            });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category not found. Please select a valid category.'
            });
        }

        // Auto-translate to Arabic if not provided
        let arabicName = name_ar;
        let arabicDescription = description_ar;

        if (!arabicName || arabicName.trim() === '') {
            console.log('🔄 Auto-translating name to Arabic...');
            arabicName = await translateToArabic(name);
        }

        if (!arabicDescription || arabicDescription.trim() === '') {
            console.log('🔄 Auto-translating description to Arabic...');
            arabicDescription = await translateToArabic(description);
        }

        // Handle images: 1 main image + up to 4 additional images
        let mainImage = '/images/default-product.jpg';
        let additionalImages = [];
        let image = '/images/default-product.jpg'; // for backward compatibility

        if (req.files && req.files.length > 0) {
            // Multiple files uploaded (up to 5: 1 main + 4 additional)
            const uploadedImages = req.files.slice(0, 5).map(file => `/uploads/${file.filename}`);
            mainImage = uploadedImages[0]; // First image is main
            additionalImages = uploadedImages.slice(1, 5); // Next 4 are additional
            image = mainImage; // for backward compatibility
        } else if (req.file) {
            // Single file uploaded (main image only)
            mainImage = `/uploads/${req.file.filename}`;
            image = mainImage;
        } else if (req.body.mainImage) {
            mainImage = req.body.mainImage;
            image = mainImage;
            if (req.body.additionalImages) {
                additionalImages = Array.isArray(req.body.additionalImages)
                    ? req.body.additionalImages.slice(0, 4)
                    : [req.body.additionalImages];
            }
        }

        console.log('Creating product with:', {
            name,
            name_ar: arabicName,
            price: Number(price),
            category,
            stock: Number(stock),
            mainImage,
            additionalImages
        });

        const product = await Product.create({
            name,
            name_ar: arabicName,
            description,
            description_ar: arabicDescription,
            price: Number(price) || 0,
            category,
            stock: Number(stock) || 0,
            mainImage,
            additionalImages,
            image, // for backward compatibility
            isAvailable: String(isAvailable) === 'true'
        });

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);

        // Log validation errors if present
        if (error.name === 'ValidationError') {
            console.error('Validation errors:', error.errors);
        }

        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            console.error('MongoDB Error Code:', error.code);
        }

        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message,
            errorName: error.name,
            ...(process.env.NODE_ENV === 'development' && {
                stack: error.stack,
                validationErrors: error.errors
            })
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Handle images update: 1 main image + up to 4 additional images
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.slice(0, 5).map(file => `/uploads/${file.filename}`);
            req.body.mainImage = uploadedImages[0]; // First image is main
            req.body.additionalImages = uploadedImages.slice(1, 5); // Next 4 are additional
            req.body.image = uploadedImages[0]; // for backward compatibility
        } else if (req.file) {
            req.body.mainImage = `/uploads/${req.file.filename}`;
            req.body.image = req.body.mainImage;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = async (req, res) => {
    try {
        console.log('📝 Adding review for product:', req.params.id);
        console.log('Request body:', req.body);
        console.log('User:', req.user);

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Veuillez vous connecter pour évaluer ce produit'
            });
        }

        const { rating, name } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'La note doit être entre 1 et 5'
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            r => r.user && r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà évalué ce produit'
            });
        }

        const review = {
            user: req.user._id,
            name: name || req.user.name || 'Client',
            rating: Number(rating)
        };

        console.log('Adding review:', review);

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        console.log('✅ Review added successfully');

        res.status(201).json({
            success: true,
            message: 'Évaluation ajoutée avec succès',
            data: product
        });
    } catch (error) {
        console.error('❌ Error adding review:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'évaluation',
            error: error.message
        });
    }
};
