import { useState } from "react";
import { checkTransactionsStatus } from "../services/api";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

const StatusCheck = () => {
  const [customOrderId, setCustomOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!customOrderId) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await checkTransactionsStatus(customOrderId);
      setStatus(res.data);
    } catch (err) {
      console.error(err);
      setStatus({ error: "Failed to fetch status" });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = () => {
    if (!status || status.error) return null;

    const mapping = {
      success: {
        label: "SUCCESS",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircleIcon className="w-5 h-5 inline mr-1" />,
      },
      pending: {
        label: "PENDING",
        color: "bg-yellow-100 text-yellow-800",
        icon: <ClockIcon className="w-5 h-5 inline mr-1" />,
      },
      failed: {
        label: "FAILED",
        color: "bg-red-100 text-red-800",
        icon: <XCircleIcon className="w-5 h-5 inline mr-1" />,
      },
    };

    const badge = mapping[status.status] || {
      label: status.status?.toUpperCase() || "UNKNOWN",
      color: "bg-zinc-100 text-zinc-600",
      icon: null,
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${badge.color}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 text-center">
        Check Transaction Status
      </h2>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter Custom Order ID"
          value={customOrderId}
          onChange={(e) => setCustomOrderId(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleCheck}
          disabled={!customOrderId || loading}
          className={`px-5 py-3 rounded-lg text-white font-semibold transition-colors ${
            !customOrderId || loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {status && (
        <div className="mt-4 p-5 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2">
          {status.error ? (
            <p className="text-red-500 font-semibold">{status.error}</p>
          ) : (
            <>
              <p className="text-zinc-700 dark:text-zinc-200 font-medium">
                Status: {renderStatusBadge()}
              </p>
              {status.transaction_amount && (
                <p className="text-zinc-600 dark:text-zinc-300">
                  Transaction Amount: <span className="font-semibold">₹{status.transaction_amount}</span>
                </p>
              )}
              {status.order_amount && (
                <p className="text-zinc-600 dark:text-zinc-300">
                  Order Amount: <span className="font-semibold">₹{status.order_amount}</span>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusCheck;
