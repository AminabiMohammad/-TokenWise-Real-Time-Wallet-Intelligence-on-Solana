import React, { useEffect, useState } from "react";
import axios from "axios";

const WalletActivity: React.FC = () => {
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/activity").then(res => setWallets(res.data));
  }, []);

  return (
    <div className="activity">
      <h3>🔥 Most Active Wallets</h3>
      <ul>
        {wallets.map((w, idx) => (
          <li key={idx}>
            {w.wallet.slice(0, 6)}...{w.wallet.slice(-4)} - {w.count} txns
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalletActivity;
