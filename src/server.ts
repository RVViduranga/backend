import cors from "cors";
import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

// Routes

import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import companyRoutes from "./routes/companies";
import jobRoutes from "./routes/jobs";
import applicationRoutes from "./routes/applications";
import matchingRoutes from "./routes/matching";
import notificationRoutes from "./routes/notifications";
import uploadRoutes from "./routes/uploads";
import profileRoutes from "./routes/profiles";
import projectRoutes from "./routes/projects";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
import { ResponseHandler } from './middleware/response-handler';
app.use(ResponseHandler);

// Serve static files from uploads directory
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve CV files
app.use('/uploads/cv', express.static(path.join(__dirname, 'uploads/cv')));
// Serve media files
app.use('/uploads/media', express.static(path.join(__dirname, 'uploads/media')));
// Serve projects and samples files
app.use('/uploads/projectsAndSamples', express.static(path.join(__dirname, 'uploads/projectsAndSamples')));

// Handle invalid JSON error gracefully
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON in request body. Please check your input.'
    });
  }
  next(err);
});

import errorHandler from './middleware/errorHandler';
app.use(errorHandler);

// Routes (✅ must be BEFORE listen)
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/projects", projectRoutes);

// Connect DB & start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("[INFO] MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[INFO] Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[ERROR] Failed to connect MongoDB:", error);
    process.exit(1);
  }
};

startServer();
