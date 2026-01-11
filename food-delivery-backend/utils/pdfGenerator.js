import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = (order, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const stream = fs.createWriteStream(outputPath);

            doc.pipe(stream);

            // Header - Company Info
            doc.fontSize(24)
                .fillColor('#FF8C42')
                .text('TABAKH DZIRI', 50, 50);

            doc.fontSize(10)
                .fillColor('#333333')
                .text('Traiteur Professionnel', 50, 80)
                .text('Algérie', 50, 95)
                .text('Tél: +213 XXX XXX XXX', 50, 110)
                .text('Email: contact@tabakhdziri.dz', 50, 125);

            // Invoice Title
            doc.fontSize(20)
                .fillColor('#FF8C42')
                .text('FACTURE', 400, 50, { align: 'right' });

            doc.fontSize(10)
                .fillColor('#666666')
                .text(`N° ${order._id.toString().slice(-8).toUpperCase()}`, 400, 80, { align: 'right' })
                .text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 400, 95, { align: 'right' });

            // Line separator
            doc.moveTo(50, 160)
                .lineTo(550, 160)
                .strokeColor('#EEEEEE')
                .stroke();

            // Customer Information
            doc.fontSize(12)
                .fillColor('#333333')
                .text('FACTURÉ À:', 50, 180);

            doc.fontSize(10)
                .text(`${order.customerInfo.firstName} ${order.customerInfo.lastName}`, 50, 200)
                .text(`Tél: ${order.customerInfo.phone}`, 50, 215)
                .text(`Email: ${order.customerInfo.email || 'N/A'}`, 50, 230);

            // Event Details
            doc.fontSize(12)
                .text('DÉTAILS DE L\'ÉVÉNEMENT:', 300, 180);

            doc.fontSize(10)
                .text(`Type: ${order.eventDetails.eventType}`, 300, 200)
                .text(`Équipe: ${order.eventDetails.teamGender}`, 300, 215)
                .text(`Lieu: ${order.eventDetails.wilaya}`, 300, 230)
                .text(`Date: ${new Date(order.eventDetails.date).toLocaleDateString('fr-FR')}`, 300, 245)
                .text(`Heure: ${order.eventDetails.time}`, 300, 260);

            // Table Header
            const tableTop = 310;
            doc.fontSize(10)
                .fillColor('#FFFFFF')
                .rect(50, tableTop, 500, 25)
                .fillAndStroke('#FF8C42', '#FF8C42');

            doc.fillColor('#FFFFFF')
                .text('Article', 60, tableTop + 8)
                .text('Quantité', 300, tableTop + 8)
                .text('Prix Unit.', 380, tableTop + 8)
                .text('Total', 480, tableTop + 8);

            // Table Items
            let yPosition = tableTop + 35;
            doc.fillColor('#333333');

            order.items.forEach((item, index) => {
                const itemTotal = item.quantity * item.price;

                // Alternate row background
                if (index % 2 === 0) {
                    doc.rect(50, yPosition - 5, 500, 25)
                        .fillAndStroke('#F9F9F9', '#F9F9F9');
                }

                doc.fillColor('#333333')
                    .text(item.name, 60, yPosition, { width: 220 })
                    .text(item.quantity.toString(), 300, yPosition)
                    .text(`${item.price} DA`, 380, yPosition)
                    .text(`${itemTotal} DA`, 480, yPosition);

                yPosition += 30;
            });

            // Summary Box
            const summaryTop = yPosition + 20;
            doc.rect(350, summaryTop, 200, 80)
                .strokeColor('#EEEEEE')
                .stroke();

            doc.fontSize(10)
                .fillColor('#666666')
                .text('Sous-total:', 360, summaryTop + 15)
                .text('TVA (0%):', 360, summaryTop + 35)
                .fontSize(12)
                .fillColor('#333333')
                .text('TOTAL:', 360, summaryTop + 55);

            doc.fontSize(10)
                .fillColor('#666666')
                .text(`${order.totalAmount} DA`, 480, summaryTop + 15, { align: 'right' })
                .text('0 DA', 480, summaryTop + 35, { align: 'right' })
                .fontSize(12)
                .fillColor('#FF8C42')
                .text(`${order.totalAmount} DA`, 480, summaryTop + 55, { align: 'right' });

            // Footer
            const footerTop = 720;
            doc.moveTo(50, footerTop)
                .lineTo(550, footerTop)
                .strokeColor('#EEEEEE')
                .stroke();

            doc.fontSize(9)
                .fillColor('#999999')
                .text('Merci pour votre confiance!', 50, footerTop + 15, { align: 'center', width: 500 })
                .text('Tabakh Dziri - Traiteur Professionnel depuis 2005', 50, footerTop + 30, { align: 'center', width: 500 });

            // Status Badge
            const statusColors = {
                'pending': '#FFA500',
                'confirmed': '#2196F3',
                'delivered': '#4CAF50',
                'cancelled': '#F44336'
            };

            const statusLabels = {
                'pending': 'EN ATTENTE',
                'confirmed': 'CONFIRMÉE',
                'delivered': 'LIVRÉE',
                'cancelled': 'ANNULÉE'
            };

            doc.rect(450, 120, 100, 25)
                .fillAndStroke(statusColors[order.status] || '#999999', statusColors[order.status] || '#999999');

            doc.fontSize(10)
                .fillColor('#FFFFFF')
                .text(statusLabels[order.status] || order.status.toUpperCase(), 450, 127, { width: 100, align: 'center' });

            doc.end();

            stream.on('finish', () => {
                resolve(outputPath);
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
};

export default generateInvoicePDF;
