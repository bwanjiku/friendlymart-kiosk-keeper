
// Email service simulation - in production, use a real email service
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private static instance: EmailService;

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    // Simulate email sending
    console.log('📧 Simulated Email Sent:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Content:', options.html);
    
    // In a real app, you would integrate with services like:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Nodemailer with SMTP
    
    // For demo purposes, we'll show an alert instead
    alert(`Email sent to ${options.to}\nSubject: ${options.subject}\n\nCheck console for full content.`);
    
    return true;
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Password Reset - FriendlyMart Supermarket',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password for your FriendlyMart Supermarket account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">FriendlyMart Supermarket Team</p>
        </div>
      `
    };

    return this.sendEmail(emailOptions);
  }
}

export const emailService = EmailService.getInstance();
