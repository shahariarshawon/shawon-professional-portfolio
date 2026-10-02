import app from "./app";
import { assertProductionEnv, env } from "./config/env";
import prisma from "./utils/prisma";
import { QueueService } from "./utils/queue.service";
import { redisService } from "./common/redis/redis.service";

assertProductionEnv();

const server = app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
  QueueService.initWorkers();
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection detected:", reason);

  server.close(async () => {
    await prisma.$disconnect();
    await redisService.close();
    process.exit(1);
  });
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception detected:", error);

  await prisma.$disconnect();
  await redisService.close();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing server...");

  server.close(async () => {
    await prisma.$disconnect();
    await redisService.close();
    process.exit(0);
  });
});