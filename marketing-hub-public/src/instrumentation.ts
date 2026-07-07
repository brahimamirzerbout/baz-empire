/**
 * Next.js instrumentation hook — fires once when the server starts.
 * We use it to kick off the background scheduler. Safe to import elsewhere
 * because the startScheduler() call dedupes via a global flag.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduler } = await import("./lib/scheduler");
    startScheduler();
    // Register graceful shutdown cleanup for SQLite
    await import("./lib/cleanup");
  }
}
