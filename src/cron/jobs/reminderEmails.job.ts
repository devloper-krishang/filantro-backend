import { addDays, addHours } from 'date-fns';
import { sendEmail } from '../../utils';
import { logger } from '../../utils/logger';
import { renderVerifyReminderTemplate } from '../../emails/templates/verifyReminder';
import { renderVerifyDeletionNoticeTemplate } from '../../emails/templates/verifyDeletionNotice';
import { IUser, User } from '../../modules/user/model/user.model';
import env from '../../config/env';
import { generateToken } from '../../utils/jwt';

// Placeholder: replace with your actual model and query logic
type EventLike = never;

// Verify reminders and cleanup cron
export async function scheduleReminderEmails(): Promise<void> {
  const now = new Date();
  const users = (await User.find({
    isEmailVerified: { $ne: true },
    createdAt: { $exists: true },
  })) as IUser[];
  for (const user of users) {
    const createdAt = user.createdAt || now;
    const in24h = now >= addHours(createdAt, 24) && now < addHours(createdAt, 24 + 5);
    const in72h = now >= addHours(createdAt, 72) && now < addHours(createdAt, 72 + 5);
    const expired = now >= addDays(createdAt, 5);

    if (expired) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Account removed',
          html: renderVerifyDeletionNoticeTemplate(),
        });
      } catch (err) {
        logger.warn(`Failed to send reminder email to ${user.email}`);
      }
      await User.deleteOne({ _id: user._id });
      continue;
    }

    const token = generateToken({ id: user._id }, env.jwt.verifyEmailExpirationMinutes);
    const verifyLink = `/auth/verify-email/${token}`;
    if (in24h) {
      await sendEmail({
        to: user.email,
        subject: 'Reminder: verify email',
        html: renderVerifyReminderTemplate(verifyLink, 24),
      });
    } else if (in72h) {
      await sendEmail({
        to: user.email,
        subject: 'Reminder: verify email',
        html: renderVerifyReminderTemplate(verifyLink, 72),
      });
    }
  }
}
