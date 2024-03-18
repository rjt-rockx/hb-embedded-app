# hyperbeam embedded app test

WebRTC is not supported in the current version Discord's Embedded Apps SDK, limiting Hyperbeam VMs to function within Discord Activities.

## setup

- install dependencies with `pnpm install`
- add `PUBLIC_DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `HYPERBEAM_API_KEY` and `DATABASE_URL` to your `.env` file
- run `pnpm db:push` to push prisma schema to db and generate prisma client
- run `pnpm start` to start the server
