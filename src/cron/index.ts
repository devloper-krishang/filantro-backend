import cron from 'node-cron';
import { logger } from '../utils/logger';
import { scheduleReminderEmails } from './jobs/reminderEmails.job';

let started = false;

export function startCronJobs(): void {
  if (started) return;
  started = true;

  // // Every 24 hours: check and send reminder emails (72h/24h windows)
  // cron.schedule('0 0 */24 * *', async () => {
  //   try {
  //     await scheduleReminderEmails();
  //   } catch (err) {
  //     logger.error('Cron: reminder emails failed');
  //   }
  // });

  // Daily at midnight: cleanup expired blacklisted tokens
  cron.schedule('0 0 * * *', async () => {
    try {
    } catch (err) {
      logger.error('Cron: cleanup blacklisted tokens failed');
    }
  });

  logger.info('Cron jobs scheduled');
}
