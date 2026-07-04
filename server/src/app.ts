import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Shawon Portfolio Server is running"
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API health check successful",
    timestamp: new Date().toISOString()
  });
});

export default app;