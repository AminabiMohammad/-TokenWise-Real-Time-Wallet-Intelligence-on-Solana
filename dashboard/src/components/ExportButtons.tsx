import React from "react";

const ExportButtons: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() => window.open("http://localhost:4000/api/export", "_blank")}
        style={{ marginRight: "10px", padding: "10px", fontWeight: "bold" }}
      >
        📄 Download JSON
      </button>
      <button
        onClick={() => window.open("http://localhost:4000/api/export/csv", "_blank")}
        style={{ padding: "10px", fontWeight: "bold" }}
      >
        📊 Download CSV
      </button>
    </div>
  );
};

export default ExportButtons;
