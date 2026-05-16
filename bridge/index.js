const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const certificateRoutes = require("./routes/certificate");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.LARAVEL_URL || "http://localhost:8000",
    "http://localhost:8000",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Accept"],
}));
app.use(express.json());

// ── Request Logger (dev-friendly) ─────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status:    "Credora Bridge is running ✅",
    timestamp: new Date().toISOString(),
    network:   "Polygon Amoy Testnet",
    contract:  process.env.CONTRACT_ADDRESS,
    explorer:  `https://amoy.polygonscan.com/address/${process.env.CONTRACT_ADDRESS}`,
  });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
// POST /api/anchor      — anchor certificate hash on-chain
// GET  /api/verify/:hash — verify certificate on-chain (free)
// POST /api/revoke      — revoke certificate on-chain
// GET  /api/total       — get total issued count from contract
// GET  /api/issuer/:address — check if address is authorized issuer
app.use("/api", certificateRoutes);

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[UNHANDLED ERROR]", err);
  res.status(500).json({ success: false, error: "Internal server error." });
});

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("─────────────────────────────────────────────");
  console.log(`🚀 Credora Bridge running on port ${PORT}`);
  console.log(`📄 Contract : ${process.env.CONTRACT_ADDRESS}`);
  console.log(`🌐 Network  : Polygon Amoy Testnet`);
  console.log(`🔗 Explorer : https://amoy.polygonscan.com/address/${process.env.CONTRACT_ADDRESS}`);
  console.log("─────────────────────────────────────────────");
});

module.exports = app;
