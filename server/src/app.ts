import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import { corsOptions } from "./config/cors";
import { env } from "./config/env";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import sendResponse from "./utils/sendResponse";

const app: Application = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shawon Portfolio Server is running",
    data: {
      service: "shawon-portfolio-server",
      version: "1.0.0"
    }
  });
});

app.use("/api", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;