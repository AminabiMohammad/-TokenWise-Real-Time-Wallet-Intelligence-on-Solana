import {
  Connection,
  PublicKey,
  ParsedInstruction,
  ParsedConfirmedTransaction,
} from "@solana/web3.js";
import * as dotenv from "dotenv";
import db from "../db/database";

dotenv.config();

const connection = new Connection(process.env.RPC_URL!);
const tokenMint = new PublicKey(process.env.TARGET_TOKEN!);

// Save transaction to DB
const insertTx = db.prepare(`
  INSERT INTO transactions (signature, wallet, amount, direction, protocol, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);


export function monitorTransactions() {
  console.log("📡 Starting dummy transaction monitor...");

  // Simulate fake buys/sells every 5 seconds
  setInterval(() => {
    const direction = Math.random() > 0.5 ? "BUY" : "SELL";
    const protocol = direction === "BUY" ? "Jupiter" : "Orca";
    const wallet = `DummyWallet_${Math.floor(Math.random() * 1000)}`;
    const amount = +(Math.random() * 100).toFixed(2);
    const timestamp = new Date().toISOString();
    const signature = `SIG_${Date.now()}_${Math.floor(Math.random() * 9999)}`;

    db.prepare(`
      INSERT OR IGNORE INTO transactions (signature, wallet, amount, direction, protocol, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(signature, wallet, amount, direction, protocol, timestamp);

    console.log(`✅ Inserted ${direction} tx for ${wallet}`);
  }, 5000);
}


async function getTokenOwner(tokenAccount: string): Promise<string | null> {
  try {
    const info = await connection.getParsedAccountInfo(new PublicKey(tokenAccount));
    return (info.value?.data as any)?.parsed?.info?.owner || null;
  } catch (err) {
    console.error("Error getting token owner:", (err as any).message);
    return null;
  }
}

async function handleTransaction(tx: ParsedConfirmedTransaction, trackedWallet: string) {
  const signature = tx.transaction.signatures[0];
  const timestamp = new Date().toISOString();

  for (const ix of tx.transaction.message.instructions) {
    if ("parsed" in ix && ix.program === "spl-token") {
      const parsed = (ix as ParsedInstruction).parsed?.info;
      const amountRaw = parsed?.amount;
      const source = parsed?.source;
      const destination = parsed?.destination;

      if (!amountRaw || !source || !destination) continue;

      const amount = parseFloat(amountRaw) / 1e6;
      const sourceOwner = await getTokenOwner(source);
      const destOwner = await getTokenOwner(destination);

      let direction = "UNKNOWN";
      if (sourceOwner === trackedWallet) direction = "SELL";
      else if (destOwner === trackedWallet) direction = "BUY";
      else {
        console.log(`🔎 Skipping unrelated tx for ${trackedWallet.slice(0, 6)}...`);
        continue;
      }

      const protocol = detectProtocol(tx);
      insertTx.run(signature, trackedWallet, amount, direction, protocol, timestamp);

      if (direction === "SELL") {
        console.log(`🔻 SELL | ${trackedWallet.slice(0, 6)}... | -${amount.toFixed(2)} | via ${protocol}`);
      } else {
        console.log(`🟢 BUY  | ${trackedWallet.slice(0, 6)}... | +${amount.toFixed(2)} | via ${protocol}`);
      }
    }
  }
}

function detectProtocol(tx: ParsedConfirmedTransaction): string {
  const logMessages = tx.meta?.logMessages?.join(" ") || "";
  if (logMessages.includes("jup.ag")) return "Jupiter";
  if (logMessages.includes("raydium")) return "Raydium";
  if (logMessages.includes("orca")) return "Orca";
  return "Unknown";
}
