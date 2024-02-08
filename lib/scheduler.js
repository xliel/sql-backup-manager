import fs from 'node:fs';
import NodeCron from 'node-cron';
import { Logger } from './util/logger.js';
import { Util } from '../lib/util/util.js';
import { config } from '../config/index.js';
import mysqlDump from 'mysqldump';

class Scheduler {
  constructor() {
    this.logger = new Logger();
    this.util = new Util();

    this.schedules = new Map();
  }

  async init() {
    try {
      if (config.main.scheduler.enabled) {
        this.logger.info('Made with ❤️ by xliel (https://xliel.com)');
        this.logger.info('[Scheduler] Starting...');
        this.logger.info(
          `[Scheduler] Timezone: ${
            Intl.DateTimeFormat().resolvedOptions().timeZone
          }`
        );

        if (config.main.scheduler.startingBackup) {
          const date = new Date();
          this.logger.info(
            `[Scheduler] Creating initial SQL backup (${this.util.formatDate(
              date
            )})`
          );
          await this.createSqlBackup(date)
            .then((dump) => {
              this.logger.info(
                `[Scheduler] Initial SQL backup created (${this.util.formatDate(
                  date
                )})`
              );

              if (config.main.discordWebhook.enabled) {
                this.createDiscordWebhook({
                  dumpFilePath: `${dump.fileName}.sql`,
                  isInitial: true,
                });
              }
            })
            .catch((err) => {
              this.logger.error(
                `[Scheduler] Failed to create initial SQL backup. Error:`,
                err
              );
            });
        }

        for (const schedule of config.main.scheduler.crons) {
          await this.createCron(schedule);
        }
      } else {
        this.logger.info(
          '[Scheduler] Disabled. To enable, set "enabled" to "true" in config/main.js'
        );
      }
    } catch (err) {
      this.logger.error(`[Scheduler] Failed to start. Error:`, err);
    }
  }

  async createCron(schedule) {
    let retries = 0;
    try {
      this.logger.info(`[Scheduler] Creating cron with ID: ${schedule.id}`);
      const cronTask = NodeCron.schedule(
        schedule.time,
        async () => {
          const date = new Date();
          await this.createSqlBackup(date)
            .then((dump) => {
              this.logger.info(
                `[Scheduler] Cron executed at ${this.util.formatDate(date)}`
              );

              if (config.main.discordWebhook.enabled) {
                this.createDiscordWebhook({
                  dumpFilePath: `${dump.fileName}.sql`,
                  schedule: schedule,
                  isInitial: false,
                });
              }
            })
            .catch((err) => {
              retries++;
              if (retries < config.main.scheduler.failedRetry) {
                this.logger.error(
                  `[Scheduler] Failed to execute cron with ID: ${schedule.id}. Retrying...`
                );
                cronTask.start();
                return;
              }

              this.logger.error(
                `[Scheduler] Failed to execute cron with ID: ${schedule.id}. Error:`,
                err
              );
            });
        },
        {
          scheduled: true,
          timezone: schedule?.timezone || 'Asia/Jerusalem',
        }
      );
      if (!cronTask) {
        this.logger.error(
          `[Scheduler] Failed to create cron with ID: ${schedule.id}`
        );
        return;
      }

      this.schedules.set(schedule.id, cronTask);
      this.logger.info(
        `[Scheduler] Cron created. Time: ${schedule.time}, ID: ${schedule.id}`
      );

      return cronTask;
    } catch (err) {
      this.logger.error(`[Scheduler] Failed to create cron. Error:`, err);
    }
  }

  async createSqlBackup(date) {
    try {
      const fileName = this.util.formatFileName(
        config.main.scheduler.fileName,
        date
      );

      const dumped = await mysqlDump({
        connection: config.mysql,
        dumpToFile: `./backups/${fileName}.sql`,
      });

      this.logger.info(`[Scheduler] SQL backup created. (${fileName}.sql)`);

      return {
        fileName,
        dumped,
      };
    } catch (err) {
      this.logger.error(`[Scheduler] Failed to create SQL backup. Error:`, err);
    }
  }

  async createDiscordWebhook({ schedule, dumpFilePath, isInitial = false }) {
    // const dumpFile = await fs.readFileSync(`./backups/${dumpFilePath}`);

    const embed = {
      title: 'Database Backup',
      description: 'A new database backup has been created.',
      color: 48062,
      fields: [
        schedule && {
          name: 'ID',
          value: schedule.id,
          inline: true,
        },
        {
          name: 'Type',
          value: isInitial ? 'Initial' : 'Scheduled',
          inline: true,
        },
        {
          name: 'Date',
          value: this.util.formatDate(new Date()),
          inline: true,
        },
        {
          name: 'File Name',
          value: dumpFilePath,
          inline: true,
        },
      ].filter(Boolean),
      footer: {
        text: 'Made with ❤️ by xliel (https://xliel.com)',
      },
      timestamp: new Date(),
    };

    this.util
      .postWebhook(config.main.discordWebhook.url, {
        embeds: [embed],
        // files: [dumpFile],
      })
      .then((webhook) => {
        if (webhook) {
          this.logger.info(
            `[Scheduler] Discord webhook posted (${
              isInitial ? 'Initial' : 'Scheduled'
            }${schedule ? `, ID: ${schedule.id}` : ''})`
          );
        } else {
          this.logger.error(
            `[Scheduler] Failed to post Discord webhook (${
              isInitial ? 'Initial' : 'Scheduled'
            }${schedule ? `, ID: ${schedule.id}` : ''})`
          );
        }
      });
  }
}

export { Scheduler };
