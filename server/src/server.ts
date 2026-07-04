import app from "./app";
import { env } from "./config/env";
import prisma from "./utils/prisma";

const server = app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection detected:", reason);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception detected:", error);

  await prisma.$disconnect();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing server...");

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});