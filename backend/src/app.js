import express from "express";
import cors from "cors";
import morgan from "morgan";

// Routes (will add later)
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
// import taskRoutes from "./routes/task.routes.js";

// Middleware
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
// app.use("/api/tasks", taskRoutes);

// Error handler
app.use(errorHandler);

export default app;