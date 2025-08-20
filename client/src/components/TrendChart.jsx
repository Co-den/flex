// client/src/components/TrendChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";

export default function TrendChart({ series = [] }) {
  // series: [{ _id: '2024-09-01', avgRating, count }, ...]
  const labels = series.map(s => s._id);
  const data = {
    labels,
    datasets: [
      {
        label: "Avg rating",
        data: series.map(s => s.avgRating ?? null),
        fill: false,
        tension: 0.2,
      },
      {
        label: "Count",
        data: series.map(s => s.count ?? 0),
        fill: false,
        yAxisID: "count",
        tension: 0.2,
      }
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, max: 10 },
      count: { position: "right", beginAtZero: true },
    },
  };

  return <Line data={data} options={options} />;
}
