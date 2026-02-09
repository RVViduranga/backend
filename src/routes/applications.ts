import express, { Request, Response } from "express";
import Application from "../models/Application";
const router = express.Router();

// Example: Get all applications
router.get("/", async (req: Request, res: Response) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;