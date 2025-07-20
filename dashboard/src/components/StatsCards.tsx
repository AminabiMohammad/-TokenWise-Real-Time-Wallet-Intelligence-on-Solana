import React, { useEffect, useState } from "react";
import axios from "axios";

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState({ buys: 0, sells: 0 });

  useEffect(() => {
    axios.get("http://localhost:4000/api/stats").then(res => setStats(res.data));
  }, []);

  return (
    <div className="stats">
      <div className="card green">🟢 Buys: {stats.buys}</div>
      <div className="card red">🔴 Sells: {stats.sells}</div>
    </div>
  );
};

export default StatsCards;
