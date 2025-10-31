import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes"; // ✅ no .js needed in TS

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// ✅ Define CORS options
const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",             // your local frontend
    "https://event-planner-tau-coral.vercel.app"  // your deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

// ✅ Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err: Error) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (_: Request, res: Response): void => {
  res.send("Event Discovery API is running...");
});

app.use("/api/events", eventRoutes);

// ✅ Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
