"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PaymentsAnalytics = () => {
  const [data, setData] = useState({ monthlyRevenue: [], monthlyStatus: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/analytics/payments");
        setData(res.data);
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-950">
        <p className="text-lg text-gray-400 animate-pulse">
          🚀 Loading analytics...
        </p>
      </div>
    );
  }

  // totals
  const totalRevenue = data.monthlyRevenue.reduce((acc, cur) => acc + cur.amount, 0);
  const totalSuccess = data.monthlyStatus.reduce((acc, cur) => acc + (cur.success || 0), 0);
  const totalFailed = data.monthlyStatus.reduce((acc, cur) => acc + (cur.failed || 0), 0);
  const totalPending = data.monthlyStatus.reduce((acc, cur) => acc + (cur.pending || 0), 0);

  // chart data
  const revenueData = {
    labels: data.monthlyRevenue.map((m) => m.month),
    datasets: [
      {
        label: "Revenue",
        data: data.monthlyRevenue.map((m) => m.amount),
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#60a5fa",
      },
    ],
  };

  const statusData = {
    labels: data.monthlyStatus.map((s) => s.month),
    datasets: [
      {
        label: "Success",
        data: data.monthlyStatus.map((s) => s.success),
        backgroundColor: "#22c55e",
        borderRadius: 6,
      },
      {
        label: "Failed",
        data: data.monthlyStatus.map((s) => s.failed),
        backgroundColor: "#ef4444",
        borderRadius: 6,
      },
      {
        label: "Pending",
        data: data.monthlyStatus.map((s) => s.pending),
        backgroundColor: "#facc15",
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Success", "Failed", "Pending"],
    datasets: [
      {
        data: [totalSuccess, totalFailed, totalPending],
        backgroundColor: ["#22c55e", "#ef4444", "#facc15"],
        borderColor: "#1f2937",
        borderWidth: 2,
      },
    ],
  };

  const cardConfig = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue}`,
      color: "text-blue-400",
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Success Payments",
      value: totalSuccess,
      color: "text-green-400",
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
    },
    {
      title: "Failed Payments",
      value: totalFailed,
      color: "text-red-400",
      icon: <XCircle className="w-6 h-6 text-red-400" />,
    },
    {
      title: "Pending Payments",
      value: totalPending,
      color: "text-yellow-400",
      icon: <Clock className="w-6 h-6 text-yellow-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-850 via-gray-900 to-gray-950 text-gray-100 p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-10 tracking-tight text-white">
        📊 Payments Analytics
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfig.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400">
                {stat.title}
              </h3>
              {stat.icon}
            </div>
            <p className={`text-2xl font-bold mt-3 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Line + Pie in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200 text-center">
            Revenue Growth
          </h2>
          <Line
            data={revenueData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: "#d1d5db" }, grid: { color: "#374151" } },
                y: { ticks: { color: "#d1d5db" }, grid: { color: "#374151" } },
              },
            }}
          />
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-200 text-center">
            Overall Payment Distribution
          </h2>
          <div className="max-w-sm mx-auto">
            <Doughnut
              data={pieData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#d1d5db", padding: 20 },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bar chart below */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-200 text-center">
          Monthly Status Breakdown
        </h2>
        <Bar
          data={statusData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top", labels: { color: "#d1d5db" } } },
            scales: {
              x: { ticks: { color: "#d1d5db" }, grid: { color: "#374151" } },
              y: { ticks: { color: "#d1d5db" }, grid: { color: "#374151" } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PaymentsAnalytics;
