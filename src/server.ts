import express from "express";
import cors from "cors";
import db from "./db/database";
import { Parser } from "json2csv";

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

app.get("/api/export", (req, res) => {
  const data = db.prepare("SELECT * FROM transactions").all();
  res.json(data);
});

app.get("/api/export/csv", (req, res) => {
  const data = db.prepare("SELECT * FROM transactions").all();
  const parser = new Parser();
  const csv = parser.parse(data);
  res.header("Content-Type", "text/csv");
  res.attachment("transactions.csv");
  res.send(csv);
});
app.get("/api/stats", (req, res) => {
  const buys = db.prepare("SELECT COUNT(*) AS count FROM transactions WHERE direction = 'BUY'").get() as any;
  const sells = db.prepare("SELECT COUNT(*) AS count FROM transactions WHERE direction = 'SELL'").get() as any;
  res.json({ buys: buys.count, sells: sells.count });
});

// GET /api/protocols
app.get("/api/protocols", (req, res) => {
  const rows = db.prepare("SELECT protocol, COUNT(*) AS count FROM transactions GROUP BY protocol").all();
  res.json(rows);
});

// GET /api/timeline
app.get("/api/timeline", (req, res) => {
  const { from, to } = req.query;
  let query = `SELECT DATE(timestamp) as day, direction, COUNT(*) as count FROM transactions`;
  const conditions = [];

  if (from) conditions.push(`timestamp >= '${from}'`);
  if (to) conditions.push(`timestamp <= '${to}'`);

  if (conditions.length) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` GROUP BY day, direction`;

  const result = db.prepare(query).all();
  res.json(result);
});


// GET /api/activity
app.get("/api/activity", (req, res) => {
  const rows = db.prepare(`
    SELECT wallet, COUNT(*) as count
    FROM transactions
    GROUP BY wallet
    ORDER BY count DESC
    LIMIT 5
  `).all();
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
});

