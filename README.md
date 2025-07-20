# 🧠 TokenWise - Real-Time Wallet Intelligence on Solana

TokenWise is a real-time wallet intelligence system that tracks the top 60 holders of any Solana token. It monitors their transactions, identifies usage of protocols like Jupiter, Raydium, and Orca, and visualizes insights via a live dashboard.

---

## 🚀 Features

- 🔍 Track Top 60 Wallet Holders for any SPL Token
- 🧠 Detect Usage of Protocols: Jupiter, Raydium, Orca
- 📈 Visual Dashboard with Stats, Charts, and Timeline
- 🕵 Real-time Transaction Monitoring
- 📦 Export Data as JSON or CSV
- ⏰ Time-based Filtering (Last 24H, 7D, 30D)

---

## 📁 Folder Structure

```
tokenwise/
├── dashboard/                  # Frontend (React)
│   ├── public/                 # Public assets like index.html, favicon
│   ├── src/                    # React source code
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ExportButtons.tsx
│   │   │   ├── ProtocolChart.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   ├── TimelineChart.tsx
│   │   │   └── WalletActivity.tsx
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── styles.css
│   │   └── ... (tests, setup, etc.)
│   ├── package.json
│   └── tsconfig.json
│
├── src/                        # Backend (Node.js/TypeScript)
│   ├── db/                     # Database setup
│   │   ├── database.ts
│   │   └── init.ts
│   ├── track/                  # Transaction monitoring logic
│   │   └── transactionMonitor.ts
│   ├── server.ts               # Express server entry point
│   └── index.ts                # Main entry
│
├── .env                        # Environment variables (excluded via .gitignore)
├── wallets.db                  # SQLite DB file (excluded via .gitignore)
├── package.json                # Backend dependencies
├── tsconfig.json               # TypeScript config
└── README.md                   # Project overview
```


## 🛠 Tech Stack

- *Backend*: Node.js, Express.js, TypeScript, @solana/web3.js, SQLite
- *Frontend*: React.js, Chart.js, Tailwind CSS
- *Blockchain*: Solana Mainnet

---

## 🧪 Live Demo

(Host locally using the steps below or deploy on Render/Netlify/Vercel.)

---

### 🔁 Step 1: Clone the Repository

```bash
git clone https://github.com/AminabiMohammad/-TokenWise-Real-Time-Wallet-Intelligence-on-Solana.git
cd tokenwise
```

---

### 🔌 Step 2: Setup Backend (Terminal-1)

Run these commands in **Terminal 1** to start the backend service:

```bash
cd tokenwise
npm install
npm run server
```

> Starts backend at `http://localhost:5000`

---

### 💻 Step 3: Setup Frontend (Terminal-2)

Open a **new terminal (Terminal 2)** in parallel and run the following:

```bash
cd tokenwise
cd ../dashboard
npm install
npm start
```

> Launches dashboard at `http://localhost:3000`

---

## 🔗 API Endpoints

| Endpoint           | Method | Description                      |
|--------------------|--------|----------------------------------|
| /api/stats       | GET    | Returns top holders and stats   |
| /api/protocols   | GET    | Shows breakdown by protocol     |
| /api/activity    | GET    | Logs of wallet activity         |
| /api/timeline    | GET    | Timeline chart data             |
| /api/export      | GET    | Export full data as JSON        |
| /api/export/csv  | GET    | Export full data as CSV         |

---

## 📊 Sample Output (JSON)

```json
[
  {
    "wallet": "7fjN5gZyW...ERs",
    "protocol": "Jupiter",
    "transactions": 25,
    "lastActive": "2025-07-10T10:24:00Z"
  },
  {
    "wallet": "BQx2hdUo...d4f",
    "protocol": "Raydium",
    "transactions": 18,
    "lastActive": "2025-07-10T09:55:00Z"
  }
]
```

## 📤 Export Features

- 🧾 Export insights as .json or .csv
- 📁 One-click download from dashboard
- 🕒 Auto-includes timestamps in filenames

---

## 📌 Future Scope

- ➕ Add support for more protocols (e.g., Mango, Serum)
- 📡 Enable Telegram/Discord wallet alerts
- 📱 Responsive Mobile UI
- 🧠 AI-based wallet behavior prediction

---

## 🤝 Contributing

PRs are welcome! For major changes, open an issue first to discuss what you would like to change.

---

## 📜 License

MIT License. Feel free to fork and build on top.

---

## 🙋‍♂ Author

*Aminabi Mohammad*  


---
