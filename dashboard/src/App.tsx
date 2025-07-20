import React from "react";
import StatsCards from "./components/StatsCards";
import ProtocolChart from "./components/ProtocolChart";
import WalletActivity from "./components/WalletActivity";
import TimelineChart from "./components/TimelineChart";
import ExportButtons from "./components/ExportButtons";
import "./styles.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>📊 TokenWise Dashboard</h1>
      <StatsCards />
      <div className="grid">
        <ProtocolChart />
        <WalletActivity />
        <ExportButtons />
      </div>
      <TimelineChart />
    </div>
  );
};

export default App;
