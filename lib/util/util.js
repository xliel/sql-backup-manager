import { format } from 'date-fns';
import axios from 'axios';

export class Util {
  constructor() {}

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async waitAndReboot(ms) {
    try {
      console.log(`[Util] Restarting in ${ms / 1000} seconds...`);
      await this.sleep(ms);
      console.log('[Util] Rebooting...');
      process.exit();
    } catch (err) {
      console.log(err);
    }
  }

  formatDate(date, timeZone) {
    return format(date, 'dd/MM/yyyy, HH:mm:ss', {
      timeZone: timeZone || 'Asia/Jerusalem',
    });
  }

  formatFileName(fileName, date = new Date()) {
    return fileName
      .replace('%Y', date.getFullYear())
      .replace('%m', date.getMonth() + 1)
      .replace('%d', date.getDate())
      .replace('%H', date.getHours())
      .replace('%M', date.getMinutes())
      .replace('%S', date.getSeconds());
  }

  async postWebhook(url, data) {
    try {
      const res = await axios.post(url, data);
      console.log(`[Util] Webhook posted. Status: ${res.status}`);

      return res;
    } catch (err) {
      console.log(`[Util] Failed to post webhook. Error:`, err);
      return null;
    }
  }
}
