import { useEffect, useState } from "react";
import { fetchTransactions } from "../services/api";
import Table from "../components/Table.jsx";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "collect_id", label: "Collect ID" },
    { key: "school_id", label: "School ID" },
    { key: "gateway_name", label: "Gateway Name" },
    { key: "order_amount", label: "Order Amount" },
    { key: "transaction_amount", label: "Transaction Amount" },
    { key: "status", label: "Status" },
    { key: "custom_order_id", label: "Custom Order ID" },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchTransactions({ status: statusFilter });
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Transactions
      </h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-200 font-medium">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-300">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-300">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table data={transactions} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default Transactions;
