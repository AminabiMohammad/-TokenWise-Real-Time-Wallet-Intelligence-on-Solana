import db from "./database";

export function initDatabase() {
  // ✅ Create top_wallets table with required columns
  db.prepare(`
    CREATE TABLE IF NOT EXISTS top_wallets (
      wallet TEXT PRIMARY KEY,
      amount REAL,
      fetched_at TEXT
    );
  `).run();

  // ✅ Create transactions table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS transactions (
      signature TEXT PRIMARY KEY,
      wallet TEXT,
      amount REAL,
      direction TEXT,
      protocol TEXT,
      timestamp TEXT
    );
  `).run();

  // ✅ Insert initial top wallets if table is empty
  const row = db.prepare("SELECT COUNT(*) as count FROM top_wallets").get() as { count: number };
  if (row.count === 0) {
    const insert = db.prepare(
      "INSERT INTO top_wallets (wallet, amount, fetched_at) VALUES (?, ?, ?)"
    );

    const wallets = [
      "u6PJ8DskA1yEjk1WZaRfMezGC88Xq2w5PVFKhMvDRXq2",
      "F7RkX6Pze73TkcQUyrUwr47ZBr3MGRd4gmp6QPKG58nQ",
      "tLoQPvWxHEKUT39sK5k7QuKjbocWiDF4AKT8uKu883yy",
      "5PAhQiXhFEd7Vm4TJ3L2xSg4sHfbpvX5etPhh67ytPRj",
      "C9U2Ks29xq6csxKmZH5v8WPC4zGMQaGcsffds51RaaUSM"
    ];

    const now = new Date().toISOString();
    for (const wallet of wallets) {
      insert.run(wallet, 0, now);
    }

    console.log("✅ Initial top wallets inserted.");
  }
}
