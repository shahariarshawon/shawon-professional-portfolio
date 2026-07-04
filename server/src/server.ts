import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection detected:", reason);

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception detected:", error);

  process.exit(1);
});