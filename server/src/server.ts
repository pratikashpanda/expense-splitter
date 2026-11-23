import { app } from "./app.js";
import { config } from "./config.js";
import { initPool, closePool } from "./db.js";

async function main() {
  await initPool();
  const server = app.listen(config.PORT, () => {
    return console.log(`listening on port ${config.PORT}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
