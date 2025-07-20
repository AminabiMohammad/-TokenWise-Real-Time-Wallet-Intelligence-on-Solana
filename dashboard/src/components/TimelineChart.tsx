import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

const TimelineChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>();
  const [range, setRange] = useState("7");

  useEffect(() => {
    const now = new Date();
    const to = now.toISOString().split("T")[0];
    const fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - parseInt(range));
    const from = fromDate.toISOString().split("T")[0];

    axios
      .get(`http://localhost:4000/api/timeline?from=${from}&to=${to}`)
      .then((res) => {
        const buys: any = {};
        const sells: any = {};
        const days: string[] = [];

        res.data.forEach((tx: any) => {
          if (!days.includes(tx.day)) days.push(tx.day);
          if (tx.direction === "BUY") buys[tx.day] = tx.count;
          if (tx.direction === "SELL") sells[tx.day] = tx.count;
        });

        days.sort();
        setChartData({
          labels: days,
          datasets: [
            {
              label: "Buys",
              data: days.map((day) => buys[day] || 0),
              borderColor: "green",
            },
            {
              label: "Sells",
              data: days.map((day) => sells[day] || 0),
              borderColor: "red",
            },
          ],
        });
      });
  }, [range]);

  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>Filter:</label>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>
      {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default TimelineChart;
