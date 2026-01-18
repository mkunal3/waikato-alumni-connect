import nodemailer from "nodemailer";

/**
 * Email service configuration
 * Uses environment variables for SMTP settings
 */
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean; // true for 465, false for other ports
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Get email configuration from environment variables
 */
function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  // If SMTP is not configured, return null (will use test mode)
  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    host,
    port: parseInt(port, 10),
    secure: port === "465", // Use secure connection for port 465
    auth: {
      user,
      pass,
    },
  };
}

/**
 * Create email transporter
 * If SMTP is not configured, creates a test account (ethereal.email)
 */
async function createTransporter() {
  const config = getEmailConfig();

  if (config) {
    // Production: Use configured SMTP
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  } else {
    // Development/Testing: Use console fallback (no actual email sending)
    console.warn("SMTP not configured. Verification code will be logged to console.");
    // Return a dummy transporter that logs to console
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
}

/**
 * Send verification code email
 */
export async function sendVerificationCodeEmail(
  to: string,
  code: string
): Promise<{ success: boolean; messageId?: string; previewUrl?: string }> {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@waikato-connect.ac.nz",
      to,
      subject: "Waikato Connect - Email Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #C8102E;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              letter-spacing: 8px;
              color: #C8102E;
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Waikato Connect</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for registering with Waikato Connect. Please use the following verification code to complete your registration:</p>
              <div class="code">${code}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you did not request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 University of Waikato / Te Whare Wānanga o Waikato. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Waikato Connect - Email Verification Code

Hello,

Thank you for registering with Waikato Connect. Please use the following verification code to complete your registration:

${code}

This code will expire in 10 minutes.

If you did not request this code, please ignore this email.

© 2025 University of Waikato / Te Whare Wānanga o Waikato. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using jsonTransport (console fallback mode), info is a JSON string
    if (!getEmailConfig()) {
      // Verification code will be logged in sendVerificationCode.ts
      return {
        success: true,
        messageId: undefined,
        previewUrl: undefined,
      };
    }

    return {
      success: true,
      messageId: info.messageId || undefined,
      previewUrl: undefined,
    };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}
