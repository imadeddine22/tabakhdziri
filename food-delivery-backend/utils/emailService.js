import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Bienvenue chez Tabakh Dziri! 🍽️',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #FF8C42; text-align: center;">Bienvenue chez Tabakh Dziri!</h1>
                    <p>Bonjour <strong>${name}</strong>,</p>
                    <p>Merci de vous être inscrit sur Tabakh Dziri, votre service de restauration de confiance pour tous vos événements spéciaux.</p>
                    <p>Nous sommes ravis de vous avoir parmi nous et nous nous réjouissons de rendre vos événements inoubliables avec nos délicieux plats algériens traditionnels.</p>
                    <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe Tabakh Dziri</strong></p>
                    <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        Tabakh Dziri - طباخ جزيري<br>
                        Cuisiner des plats délicieux depuis 2005
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // Don't throw error - email failure shouldn't prevent registration
        // Just log it and continue
    }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, name, order) => {
    try {
        const transporter = createTransporter();

        const itemsList = order.items.map(item =>
            `<li>${item.name} - Quantité: ${item.quantity} - ${item.price} DA</li>`
        ).join('');

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Confirmation de commande #${order._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4CAF50; text-align: center;">Commande confirmée! ✅</h1>
                    <p>Bonjour <strong>${name}</strong>,</p>
                    <p>Votre commande a été reçue avec succès. Nous vous remercions de votre confiance!</p>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="color: #333; margin-top: 0;">Détails de la commande:</h2>
                        <p><strong>Numéro de commande:</strong> #${order._id}</p>
                        <p><strong>Date de l'événement:</strong> ${new Date(order.eventDetails.date).toLocaleDateString('fr-FR')}</p>
                        <p><strong>Heure:</strong> ${order.eventDetails.time}</p>
                        <p><strong>Lieu:</strong> ${order.eventDetails.location}, ${order.eventDetails.wilaya}</p>
                        
                        <h3 style="color: #333;">Articles commandés:</h3>
                        <ul>
                            ${itemsList}
                        </ul>
                        
                        <p style="font-size: 18px; font-weight: bold; color: #FF8C42;">
                            Total: ${order.totalAmount} DA
                        </p>
                    </div>
                    
                    <p>Notre équipe vous contactera bientôt pour confirmer tous les détails.</p>
                    <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe Tabakh Dziri</strong></p>
                    
                    <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        Tabakh Dziri - طباخ جزيري<br>
                        Pour toute question, contactez-nous à: tabakhdziri@gmail.com
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation email sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
        // Don't throw error - email failure shouldn't prevent order creation
        // Just log it and continue
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Réinitialisation de votre mot de passe - Tabakh Dziri',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #FF8C42; text-align: center;">Réinitialisation de mot de passe</h1>
                    <p>Bonjour <strong>${name}</strong>,</p>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe sur Tabakh Dziri.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; font-size: 14px; color: #666;">Votre code de vérification est:</p>
                        <h2 style="color: #FF8C42; font-size: 36px; margin: 10px 0; letter-spacing: 5px;">${resetToken}</h2>
                        <p style="margin: 0; font-size: 12px; color: #999;">Ce code expire dans 10 minutes</p>
                    </div>
                    
                    <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
                    <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe Tabakh Dziri</strong></p>
                    
                    <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        Tabakh Dziri - طباخ جزيري<br>
                        Pour toute question, contactez-nous à: tabakhdziri@gmail.com
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw error; // Throw error for password reset as it's critical
    }
};
