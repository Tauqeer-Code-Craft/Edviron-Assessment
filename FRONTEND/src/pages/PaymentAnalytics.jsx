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
      <div className="flex items-center justify-center h-[60vh] bg-gray-100">
        <p className="text-lg text-gray-500 animate-pulse">🚀 Loading analytics...</p>
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
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#3b82f6",
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
        borderColor: "#e5e7eb",
        borderWidth: 2,
      },
    ],
  };

  const cardConfig = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue}`,
      color: "text-blue-600",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Success Payments",
      value: totalSuccess,
      color: "text-green-600",
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Failed Payments",
      value: totalFailed,
      color: "text-red-600",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
    {
      title: "Pending Payments",
      value: totalPending,
      color: "text-yellow-600",
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 space-y-12">
  <h1 className="text-4xl font-bold text-center mb-10 tracking-tight">
    📊 Payments Analytics
  </h1>

  {/* Stat Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {cardConfig.map((stat, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 transition"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {stat.title}
          </h3>
          {stat.icon}
        </div>
        <p className={`text-2xl font-bold mt-3 ${stat.color}`}>{stat.value}</p>
      </div>
    ))}
  </div>

  {/* Line + Pie Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
        Revenue Growth
      </h2>
      <Line
        data={revenueData}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb dark:#374151" } },
            y: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb dark:#374151" } },
          },
        }}
      />
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
        Overall Payment Distribution
      </h2>
      <div className="max-w-sm mx-auto">
        <Doughnut
          data={pieData}
          options={{
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "#6b7280" }, // could use dark mode JS colors if needed
              },
            },
          }}
        />
      </div>
    </div>
  </div>

  {/* Bar chart */}
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700">
    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
      Monthly Status Breakdown
    </h2>
    <Bar
      data={statusData}
      options={{
        responsive: true,
        plugins: { legend: { position: "top", labels: { color: "#6b7280" } } },
        scales: {
          x: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb dark:#374151" } },
          y: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb dark:#374151" } },
        },
      }}
    />
  </div>
</div>

  );
};

export default PaymentsAnalytics;
