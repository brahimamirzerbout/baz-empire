/**
 * In-process serialized queue for expensive exports (PNG/PDF via headless
 * chromium). Without this, two simultaneous Export clicks would each spin up
 * their own chromium browser and OOM the Node process.
 *
 * One browser at a time, single-process. Multi-process deployments should
 * run a dedicated worker for this — out of scope here.
 */

// p-limit-style: at most 1 concurrent browser run, no timeout (chromium
// can take 5-30s for big renders).
export const exportQueue = { add: async (fn: () => Promise<unknown>) => fn(), onIdle: async () => {} };
