import { sendEmail } from '../config/email.js';

/**
 * Email Notification Service
 * Provides template-based email helpers for common ERP events.
 */
export const EmailService = {
  /**
   * Send a password reset email with a token link.
   * @param {string} to         - Recipient email
   * @param {string} userName   - Recipient name
   * @param {string} resetUrl   - Full password reset URL
   */
  async sendPasswordReset(to, userName, resetUrl) {
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
            <div style="background:#1a1a2e; padding:24px; text-align:center;">
              <h1 style="color:#fff; margin:0; font-size:24px;">🧅 OnionERP</h1>
              <p style="color:#aaa; margin:4px 0 0;">Export-Import ERP Platform</p>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#1a1a2e;">Password Reset Request</h2>
              <p>Hello <strong>${userName}</strong>,</p>
              <p>We received a request to reset your OnionERP account password.</p>
              <p style="margin:28px 0; text-align:center;">
                <a href="${resetUrl}" 
                   style="background:#e63946; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:bold;">
                  Reset My Password
                </a>
              </p>
              <p style="color:#666; font-size:13px;">
                This link expires in <strong>30 minutes</strong>. 
                If you did not request a reset, please ignore this email.
              </p>
            </div>
            <div style="background:#f8f9fa; padding:16px; text-align:center;">
              <p style="color:#999; font-size:12px; margin:0;">
                © ${new Date().getFullYear()} OnionERP. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    await sendEmail({ to, subject: 'OnionERP — Password Reset Request', html });
  },

  /**
   * Send a sales order confirmation email.
   * @param {string} to          - Recipient email
   * @param {string} customerName
   * @param {Object} order       - { orderNo, items, subtotal, gstAmount, discount }
   */
  async sendOrderConfirmation(to, customerName, order) {
    const total = (order.subtotal || 0) - (order.discount || 0) + (order.gstAmount || 0);
    const itemRows = (order.items || [])
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px 12px; border-bottom:1px solid #eee;">${i.product?.name || 'Product'}</td>
            <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:center;">${i.quantity}</td>
            <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:right;">₹${(i.amount || 0).toFixed(2)}</td>
          </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
          <div style="max-width:620px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
            <div style="background:#1a1a2e; padding:24px; text-align:center;">
              <h1 style="color:#fff; margin:0; font-size:24px;">🧅 OnionERP</h1>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#1a1a2e;">Order Confirmation</h2>
              <p>Dear <strong>${customerName}</strong>,</p>
              <p>Your order <strong>#${order.orderNo}</strong> has been successfully placed.</p>
              <table style="width:100%; border-collapse:collapse; margin:20px 0;">
                <thead>
                  <tr style="background:#1a1a2e; color:#fff;">
                    <th style="padding:10px 12px; text-align:left;">Product</th>
                    <th style="padding:10px 12px; text-align:center;">Qty</th>
                    <th style="padding:10px 12px; text-align:right;">Amount</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
              <div style="text-align:right; padding:0 12px;">
                <p style="margin:4px 0; color:#555;">Discount: -₹${(order.discount || 0).toFixed(2)}</p>
                <p style="margin:4px 0; color:#555;">GST: ₹${(order.gstAmount || 0).toFixed(2)}</p>
                <h3 style="color:#1a1a2e;">Grand Total: ₹${total.toFixed(2)}</h3>
              </div>
              <p style="margin-top:24px; color:#555;">
                Our team will process your order shortly. You can track the status on the OnionERP portal.
              </p>
            </div>
            <div style="background:#f8f9fa; padding:16px; text-align:center;">
              <p style="color:#999; font-size:12px; margin:0;">
                © ${new Date().getFullYear()} OnionERP. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    await sendEmail({ to, subject: `OnionERP — Order Confirmation #${order.orderNo}`, html });
  },

  /**
   * Send a welcome email when a new user account is created.
   * @param {string} to
   * @param {string} userName
   * @param {string} tempPassword   - Initial temporary password
   */
  async sendWelcome(to, userName, tempPassword) {
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family:Arial,sans-serif; background:#f4f4f4; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
            <div style="background:#1a1a2e; padding:24px; text-align:center;">
              <h1 style="color:#fff; margin:0;">🧅 Welcome to OnionERP</h1>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#1a1a2e;">Your account is ready!</h2>
              <p>Hello <strong>${userName}</strong>,</p>
              <p>Your OnionERP account has been created. Here are your login credentials:</p>
              <div style="background:#f8f9fa; padding:20px; border-radius:6px; margin:20px 0;">
                <p style="margin:4px 0;"><strong>Email:</strong> ${to}</p>
                <p style="margin:4px 0;"><strong>Temporary Password:</strong> <code>${tempPassword}</code></p>
              </div>
              <p style="color:#e63946; font-weight:bold;">
                ⚠️ Please change your password immediately after first login.
              </p>
            </div>
            <div style="background:#f8f9fa; padding:16px; text-align:center;">
              <p style="color:#999; font-size:12px; margin:0;">
                © ${new Date().getFullYear()} OnionERP. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    await sendEmail({ to, subject: 'Welcome to OnionERP — Your Account Details', html });
  },
};

export default EmailService;
