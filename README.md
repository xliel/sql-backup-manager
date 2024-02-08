<h1 align="center">Sql Backup Manager</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/xliel/sql-backup-manager?color=56BEB8">
  <img alt="Github language count" src="https://img.shields.io/github/languages/count/xliel/sql-backup-manager?color=56BEB8">
  <img alt="License" src="https://img.shields.io/github/license/xliel/sql-backup-manager?color=56BEB8">
  <img alt="Github issues" src="https://img.shields.io/github/issues/xliel/sql-backup-manager?color=56BEB8" />
  <img alt="Github forks" src="https://img.shields.io/github/forks/xliel/sql-backup-manager?color=56BEB8" />
  <img alt="Github stars" src="https://img.shields.io/github/stars/xliel/sql-backup-manager?color=56BEB8" />
</p>

## 🎯 About

This project was created to manage backups of SQL databases, it allows you to create multiple schedules for backups and send notifications to a Discord webhook when the backup is completed.

## ✨ Features

- Create multiple schedules for backups.
- Support a variety of timezones. Default is **Asia/Jerusalem**.
- Discord webhook integration for notifications on backup completion.

## ✅ Requirements

Before starting 🏁, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed.

## 🏁 Starting

```bash
# Clone this project
$ git clone https://github.com/xliel/sql-backup-manager

# Access
$ cd sql-backup-manager

# Install dependencies
$ yarn

# Change the .env.example file to .env and fill in the required fields
$ mv .env.example .env # Linux
$ ren .env.example .env # Windows

# Run the project
$ yarn start

# The server will initialize in the <http://localhost:3000>
```

## License

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.

Made with ❤ by <a href="https://github.com/xliel" target="_blank">xliel</a> ([Discord](https://discord.com/users/417398665670295572)).

&#xa0;

<a href="#top">Back to top</a>
