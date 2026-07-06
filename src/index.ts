import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import router from "./routes/routes";
import { login } from "./controllers/auth.controllers";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "img-src": ["'self'", "https://res.cloudinary.com", "data:"],
                "video-src": ["'self'", "https://res.cloudinary.com"],
                "script-src": ["'self'", "https://www.paypal.com"],
            },
        },
    }),
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(morgan("dev"));


// CORS
// app.use(cors());

// server.ts
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = process.env.FRONTEND_URL?.replace(/\/$/, "");
      // ✅ Allow requests with no origin (server-to-server, like Next.js middleware)
      if (!origin || origin === allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-For-secreat"],
    maxAge: 86400,
  })
);

app.set("trust proxy", 1);


// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});


app.use("/bs", limiter, router);


app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500).send({
        status: err.status || 500,
        message: err.message,
    });
});

const PORT = process.env.PORT || 8000;



const startServer = async () => {
  try {
    console.log("🔄 Starting server...");

    console.log("🔄 Connecting DB...");
    await connectDB();

    console.log("✅ DB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running @ http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();


