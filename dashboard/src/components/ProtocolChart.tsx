import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProtocolChart: React.FC = () => {
  const [data, setData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    axios.get("http://localhost:4000/api/protocols").then(res => {
      const labels = res.data.map((d: any) => d.protocol);
      const counts = res.data.map((d: any) => d.count);
      setData({
        labels,
        datasets: [
          {
            label: "Protocol Usage",
            data: counts,
            backgroundColor: ["#36a2eb", "#ff6384", "#ffcd56", "#4bc0c0"],
          },
        ],
      });
    });
  }, []);

  return <Pie data={data} />;
};

export default ProtocolChart;
