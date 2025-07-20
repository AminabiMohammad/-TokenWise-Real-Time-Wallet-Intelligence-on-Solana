import express, { Request, Response } from "express";
import cors from "cors";
import { Connection, PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import db from "./db/database";
import { initDatabase } from "./db/init"; // ✅ Ensure table creation
import { monitorTransactions } from "./track/transactionMonitor";
dotenv.config();

const app = express();
const PORT = 4000;
const RPC_URL = process.env.RPC_URL!;
const TOKEN_ADDRESS = process.env.TARGET_TOKEN!;
const connection = new Connection(RPC_URL);

app.use(cors());
app.use(express.json());

// ---------- APIs for frontend ---------------- //
import fs from "fs";
import path from "path";

// Export all transactions as JSON
app.get("/api/export/json", (req, res) => {
  const rows = db.prepare("SELECT * FROM transactions ORDER BY timestamp DESC").all();
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(rows, null, 2));
});

// Export all transactions as CSV
app.get("/api/export", (req, res) => {
  res.send(`
    <h2>Download Transactions</h2>
    <ul>
      <li><a href="/api/export/json" target="_blank">Download JSON</a></li>
      <li><a href="/api/export/csv" target="_blank">Download CSV</a></li>
    </ul>
  `);
});
app.get("/api/export/csv", (req: Request, res: Response): void => {
  const rows = db.prepare("SELECT * FROM transactions ORDER BY timestamp DESC").all() as Record<string, any>[];
  if (!rows.length) {
    res.status(404).send("No transactions found");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
    ),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
  res.send(csv);
});

app.get("/api/stats", (req, res) => {
  const buys = (db.prepare("SELECT COUNT(*) AS count FROM transactions WHERE direction = 'BUY'").get() as any).count;
  const sells = (db.prepare("SELECT COUNT(*) AS count FROM transactions WHERE direction = 'SELL'").get() as any).count;
  res.json({ buys, sells });
});

app.get("/api/protocols", (req, res) => {
  const rows = db.prepare("SELECT protocol, COUNT(*) as count FROM transactions GROUP BY protocol").all();
  res.json(rows);
});

app.get("/api/timeline", (req, res) => {
  const rows = db.prepare(`
    SELECT strftime('%Y-%m-%d', timestamp) as day, direction, COUNT(*) as count
    FROM transactions
    GROUP BY day, direction
    ORDER BY day
  `).all();
  res.json(rows);
});

app.get("/api/activity", (req, res) => {
  const rows = db.prepare(`
    SELECT wallet, COUNT(*) as count
    FROM transactions
    GROUP BY wallet
    ORDER BY count DESC
    LIMIT 10
  `).all();
  res.json(rows);
});

// ---------- Start Server & Initialization ---------- //

app.listen(PORT, async () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
  await init(); // Wrap all startup logic
});

// ---------- Helper Functions ---------------- //



async function init() {
  await initDatabase();        // ✅ Create required tables if not exist
  await getTopTokenHolders();  // ✅ Fetch and store top holders
  monitorTransactions();       // ✅ Start monitoring live txns
}

async function getTopTokenHolders() {
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO top_wallets (wallet, amount, fetched_at) VALUES (?, ?, ?)
  `);

  const tokenPublicKey = new PublicKey(TOKEN_ADDRESS);
  const response = await connection.getTokenLargestAccounts(tokenPublicKey);
  const accounts = response.value;
  const now = new Date().toISOString();

  for (let i = 0; i < accounts.length && i < 60; i++) {
    const account = accounts[i];
    const accountInfo = await connection.getParsedAccountInfo(new PublicKey(account.address));

    const owner = (accountInfo.value?.data as any)?.parsed?.info?.owner;
    const amount = (accountInfo.value?.data as any)?.parsed?.info?.tokenAmount?.uiAmount;

    if (owner && amount) {
      insertStmt.run(owner, amount, now);
      console.log(`Wallet ${i + 1}:`);
      console.log(`Address: ${owner}`);
      console.log(`Amount: ${amount}`);
      console.log("----------------------");
    }
  }

  console.log("✅ Wallets saved to database!");
}
app.post("/api/test-insert", (req, res) => {
  const direction = req.body.direction || "BUY";
  const protocol = req.body.protocol || "Jupiter";
  const wallet = `Manual_${Math.floor(Math.random() * 9999)}`;
  const amount = Math.random() * 100;
  const timestamp = new Date().toISOString();
  const signature = `SIG_MANUAL_${Date.now()}`;

  try {
    db.prepare(`
      INSERT OR IGNORE INTO transactions (signature, wallet, amount, direction, protocol, timestamp)
    `).run(signature, wallet, amount, direction, protocol, timestamp);

    res.json({ message: "✅ Inserted manually" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "❌ Insert failed" });
  }
});
