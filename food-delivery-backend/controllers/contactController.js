import Contact from '../models/Contact.js';

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
export const createContactMessage = async (req, res) => {
    try {
        const { name, email, phone, eventType, guests, date, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !eventType || !guests || !date || !message) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        // Create contact message
        const contact = await Contact.create({
            name,
            email,
            phone,
            eventType,
            guests,
            date,
            message
        });

        res.status(201).json({
            success: true,
            message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً',
            data: contact
        });
    } catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إرسال الرسالة',
            error: error.message
        });
    }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContactMessages = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب الرسائل',
            error: error.message
        });
    }
};

// @desc    Get single contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactMessageById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'الرسالة غير موجودة'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Error fetching contact message:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب الرسالة',
            error: error.message
        });
    }
};

// @desc    Update contact message status
// @route   PATCH /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'الرسالة غير موجودة'
            });
        }

        if (status) contact.status = status;
        if (notes !== undefined) contact.notes = notes;

        await contact.save();

        res.status(200).json({
            success: true,
            message: 'تم تحديث حالة الرسالة',
            data: contact
        });
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تحديث الرسالة',
            error: error.message
        });
    }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'الرسالة غير موجودة'
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'تم حذف الرسالة'
        });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء حذف الرسالة',
            error: error.message
        });
    }
};
