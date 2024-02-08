import dotEnv from 'dotenv';
dotEnv.config();

export const main = {
  scheduler: {
    enabled: true, // Enable or disable the scheduler
    startingBackup: true, // If true, the first backup will be created when the process starts
    fileName: '%Y_%m_%d-%H_%M_%S.sql', // Date format. Example: 2021_08_01-12_00_00.sql
    failedRetry: 3, // Number of retries if the cron fails
    crons: [
      // Every day at 6:00 AM
      {
        id: 'daily-at-6am', // Unique ID for the cron. Used for logging and debugging. Example: 'daily-at-6am
        time: '0 0 6 * * *',
        timezone: 'Asia/Jerusalem',
      },
      // Every day at 12:00 PM
      {
        id: 'daily-at-12pm', // Unique ID for the cron. Used for logging and debugging. Example: 'daily-at-12pm
        time: '0 0 12 * * *',
        timezone: 'Asia/Jerusalem',
      },
      // Every week on Sunday at 12:00 PM
      {
        id: 'weekly-on-sunday-at-12pm', // Unique ID for the cron. Used for logging and debugging. Example: 'weekly-on-sunday-at-12pm
        time: '0 0 12 * * Sunday',
        timezone: 'Asia/Jerusalem',
      },
    ],
  },
  discordWebhook: {
    enabled: true, // Enable or disable the webhook feature
    url: process.env.DISCORD_WEBHOOK_URL, // Discord webhook URL
  },
  logger: {
    timezone: 'Asia/Jerusalem', // Timezone for the logger. Example: 'Asia/Jerusalem'
    format: 'DD/MM/YYYY HH:mm:ss', // Date format. Example: 'DD/MM/YYYY HH:mm:ss'
  },
};

// Cron time format
// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *

// Allowed values
// second - 0-59
// minute - 0-59
// hour - 0-23
// day of month - 1-31
// month - 1-12 (or names, e.g: Jan, Feb, March, April)
// day of week - 0-7 0-7 (0 or 7 are sunday, or names, e.g. Sunday, Monday, Tue, Wed)
