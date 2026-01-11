import Order from '../models/Order.js';
import generateInvoicePDF from '../utils/pdfGenerator.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Generate invoice PDF for an order
// @route   GET /api/orders/:id/invoice
// @access  Private
export const generateInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this invoice'
            });
        }

        // Create invoices directory if it doesn't exist
        const invoicesDir = path.join(__dirname, '..', 'public', 'invoices');
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
        }

        const fileName = `invoice-${order._id}.pdf`;
        const filePath = path.join(invoicesDir, fileName);

        // Generate PDF
        await generateInvoicePDF(order, filePath);

        // Send file
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({
                    success: false,
                    message: 'Error downloading invoice'
                });
            }
        });

    } catch (error) {
        console.error('Invoice generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating invoice',
            error: error.message
        });
    }
};
