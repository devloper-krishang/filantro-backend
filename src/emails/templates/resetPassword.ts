import { renderLayout } from './layout';

export function renderResetPasswordTemplate(resetUrl: string): string {
  return renderLayout({
    title: 'Reset your password',
    previewText: 'Reset your password',
    heading: 'Reset your password',
    body: `<p>To reset your password, click the link below:</p>`,
    ctaText: 'Reset Password',
    ctaUrl: resetUrl,
  });
}

export function renderResetPasswordCodeTemplate(code: string): string {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 480px; margin: auto; padding: 20px;">
    <h2 style="color: #15536C;">Reset your password</h2>
    <p>Hello,</p>
    <p>Please use the code below to reset your password:</p>
    <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; text-align: center; color: #F6BA18;">
      ${code}
    </div>
    <p>This code will expire in 30 minutes.</p>
    <p>If you didn’t request this email, you can safely ignore it.</p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
    <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} Filantropiapr. All rights reserved.</p>
  </div>
  `;
}
