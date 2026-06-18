import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { AppError } from "./lib/httpError";
import { briefsRouter } from "./routes/briefs";
import { tasksRouter } from "./routes/tasks";
import { clickupRouter } from "./routes/clickup";
import { productionRouter } from "./routes/production";
import { dashboardRouter } from "./routes/dashboard";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "5mb" }));

  // Health check.
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "campaign-system-backend" });
  });

  // API routes.
  app.use("/api/briefs", briefsRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api/clickup", clickupRouter);
  app.use("/api/production", productionRouter);
  app.use("/api/dashboard", dashboardRouter);

  // 404 for unknown API routes.
  app.use((req, res) => {
    res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
  });

  // Central error handler — keeps the server from crashing and returns clean JSON.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message, details: err.details });
      return;
    }
    // eslint-disable-next-line no-console
    console.error("Unhandled error:", err);
    const message =
      err instanceof Error ? err.message : "Error interno del servidor.";
    res.status(500).json({ error: message });
  });

  return app;
}
