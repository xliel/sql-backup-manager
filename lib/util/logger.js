import { Timestamp } from '@skyra/timestamp';
import chalk from 'chalk';
import { config } from '../../config/index.js';

export class Logger {
  constructor() {
    this.template = new Timestamp(
      config.main.logger.format || 'DD/MM/YYYY ,HH:mm:ss'
    );
  }

  get timestamp() {
    return this.template.display(
      new Date().toLocaleString('en-US', {
        timeZone: config.main.logger.timezone || 'Asia/Jerusalem',
      })
    );
  }

  info(...args) {
    return console.log(
      chalk.bold(`[${this.timestamp}]: ${chalk.bgBlue('LOG')} ➜ ${args}`)
    );
  }

  error(...args) {
    return console.log(
      chalk.bold(`[${this.timestamp}]: ${chalk.bgRed('ERROR')} ➜ ${args}`)
    );
  }
}
