import { config } from "./lib/config";
import { createApp } from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`\n  ◈ Agency API running → http://localhost:${config.port}`);
    console.log(`    GET  /api/agencies          list (+ ?search= ?category=)`);
    console.log(`    GET  /api/agencies/:id      detail`);
    console.log(`    POST /api/agencies          create   ${config.adminApiKey ? "(X-Api-Key)" : "(open in dev)"}`);
    console.log(`    PUT  /api/agencies/:id      update   ${config.adminApiKey ? "(X-Api-Key)" : "(open in dev)"}`);
    console.log(`    DEL  /api/agencies/:id      delete   ${config.adminApiKey ? "(X-Api-Key)" : "(open in dev)"}`);
    console.log(`    GET  /health                health\n`);
  });

  // Graceful shutdown
  const shutdown = async (sig: string) => {
    console.log(`\n  ${sig} received — shutting down…`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("  Closed out remaining connections.");
      process.exit(0);
    });
    // force-exit if something hangs
    setTimeout(() => process.exit(1), 8000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});