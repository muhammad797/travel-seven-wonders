import logger from './logger';

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send email (mock implementation - replace with actual email service)
 * In production, use services like SendGrid, AWS SES, Nodemailer, etc.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> {
  // Mock email sending - in production, integrate with email service
  logger.info(`[EMAIL] To: ${to}, Subject: ${subject}`);
  logger.info(`[EMAIL] Body: ${text || html}`);
  
  // In development, log the email instead of sending
  if (process.env.NODE_ENV === 'development') {
    console.log('\n📧 EMAIL SENT (Development Mode):');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}\n`);
  }
  
  // Simulate async email sending
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Send email verification OTP
 */
export async function sendVerificationEmail(email: string, otp: string, firstName: string): Promise<void> {
  const subject = 'Verify your email - Travel Seven Wonders';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Travel Seven Wonders, ${firstName}!</h2>
      <p>Thank you for signing up. Please verify your email address by entering the OTP below:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
        <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  `;
  const text = `Welcome to Travel Seven Wonders, ${firstName}!\n\nPlease verify your email address by entering this OTP: ${otp}\n\nThis OTP will expire in 10 minutes.`;

  await sendEmail(email, subject, html, text);
}

/**
 * Send password reset OTP
 */
export async function sendPasswordResetEmail(email: string, otp: string, firstName: string): Promise<void> {
  const subject = 'Password Reset Request - Travel Seven Wonders';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hello ${firstName},</p>
      <p>You requested to reset your password. Please use the OTP below to reset your password:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
        <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
    </div>
  `;
  const text = `Hello ${firstName},\n\nYou requested to reset your password. Please use this OTP: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`;

  await sendEmail(email, subject, html, text);
}

