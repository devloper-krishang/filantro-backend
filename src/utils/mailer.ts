import nodemailer, { Transporter } from 'nodemailer';
import { google } from 'googleapis';
import env from '../config/env';

const { user, clientId, clientSecret, redirectUri, refreshToken } = env.email.auth;

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

let transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (!transporter) {
    const accessToken = await oAuth2Client.getAccessToken();

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user,
        clientId,
        clientSecret,
        refreshToken,
        accessToken: accessToken?.token || undefined,
      },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }: MailOptions): Promise<void> {
  const mailTransporter = await getTransporter();

  await mailTransporter.sendMail({
    from: `"No Reply" <${user}>`,
    to,
    subject,
    html,
  });
}
