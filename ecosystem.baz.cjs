// BAZ local instances — PM2 ecosystem (marketing site + hub).
//
// Status: PREPARED, not yet applied. Another operator was actively
// reconfiguring the baz Vercel project (vercel env rm) at the moment this
// was written, so the running bare `next start` processes were left alone
// to avoid disruption. Both are daemonized (PPID=1) and survive logout;
// the only gap is crash-restart + persistent logs, which this fixes.
//
// WHEN TO APPLY: once the concurrent Vercel/git work on baz has settled.
//
// APPLY (one-off):
//   pm2 delete baz-site baz-hub 2>/dev/null            # clear any stale
//   # Stop the bare processes first (they hold :3000 / :3001):
//   kill 2003013   # baz marketing site (npm run start -> next start -p 3000)
//   kill 1891562   # hub (pnpm exec next start -p 3001)
//   pm2 start /home/uzer/ecosystem.baz.cjs
//   pm2 save
//   pm2 startup   # prints a sudo command to enable boot survival
//
// ROLLBACK (if PM2 start fails):
//   pm2 delete baz-site baz-hub
//   cd /home/uzer/baz           && nohup npm run start > /tmp/baz.log 2>&1 &
//   cd /home/uzer/marketing-hub && nohup pnpm exec next start -p 3001 > /tmp/hub.log 2>&1 &
//
// LOGS (persistent, survive rotation):
//   pm2 logs baz-site   /   pm2 logs baz-hub

module.exports = {
  apps: [
    {
      name: "baz-site",
      cwd: "/home/uzer/baz",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production", PORT: "3000" },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      exp_backoff_restart_delay: 200,
      max_restarts: 20,
      time: true,
      out_file: "/home/uzer/.pm2/logs/baz-site-out.log",
      error_file: "/home/uzer/.pm2/logs/baz-site-error.log",
      merge_logs: true,
    },
    {
      name: "baz-hub",
      cwd: "/home/uzer/marketing-hub",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      env: { NODE_ENV: "production", PORT: "3001" },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      exp_backoff_restart_delay: 200,
      max_restarts: 20,
      time: true,
      out_file: "/home/uzer/.pm2/logs/baz-hub-out.log",
      error_file: "/home/uzer/.pm2/logs/baz-hub-error.log",
      merge_logs: true,
    },
  ],
};