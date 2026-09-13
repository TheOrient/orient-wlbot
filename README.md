# Orient FiveM Whitelist Bot

> **Legacy project** — originally created in 2019 for ESX-based FiveM servers.

Orient FiveM Whitelist Bot is a Node.js Discord bot for managing whitelist access in ESX-style FiveM server databases. It allows authorized staff to add or remove players from whitelist tables directly from Discord.

## Features

- Add players to the whitelist using Steam identifiers
- Remove whitelist access by Discord ID
- Remove whitelist access by Steam hex identifier
- Maintain a simple blacklist
- List whitelisted players
- List blacklisted players
- Assign or remove Discord roles during whitelist operations
- Restart the bot through a Discord command
- Built-in help command

## Requirements

- Node.js
- npm
- MySQL-compatible database
- Discord bot application and token
- Steam Web API key
- ESX-style whitelist database or compatible custom schema

## Installation

1. Install Node.js.
2. Clone or download the repository.
3. Open a terminal in the project directory.
4. Install dependencies:

```bash
npm install
```

5. Update the configuration values in `run.js`.
6. Configure the database connection.
7. Start the bot with the included `start.bat` file or directly with Node.js.

## Configuration

Review and update the values near the beginning of `run.js`:

- Steam API key
- Discord channel ID
- Discord bot token
- Logo/image URL
- Whitelist role ID
- Database connection settings

Also update any hard-coded branding or server URLs to match your own community.

## Example Commands

```text
!ekle <steamhex> <@discord_user>
!kaldırdc <discord_id>
!kaldırhex <steamhex> <discord_user>
!blacklistekle <steamhex> <reason>
!blacklistler
!whitelistler
!restart
!yardım
```

## Modernization Notes

This project targets the ESX database structures commonly used around 2019–2020. Modern FiveM servers may use very different identifier, whitelist, role, and player-data models.

To adapt the bot for a current environment, review and update:

- SQL queries
- table and column names
- Steam/Discord identifier handling
- Discord library usage
- permission and role checks
- error handling and logging

## Security

Do not hard-code real bot tokens, API keys, or production database credentials in source files. Use environment variables or a local configuration file excluded by `.gitignore`.

If credentials were ever committed publicly, rotate them before reusing this project.

## Legacy Notice

This repository is preserved as part of my development history. It demonstrates an early Discord + SQL automation workflow for FiveM administration, but it should be reviewed and modernized before production use today.
