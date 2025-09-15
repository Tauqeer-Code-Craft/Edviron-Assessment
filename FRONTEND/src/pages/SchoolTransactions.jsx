import { useEffect, useState } from "react";
import { fetchTransactionsBySchool } from "../services/api";
import Table from "../components/Table.jsx";

const SchoolTransactions = () => {
  const [schoolInput, setSchoolInput] = useState("");   // raw input from user
  const [schoolId, setSchoolId] = useState("");         // debounced value
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "custom_order_id", label: "Order ID" },
    { key: "school_id", label: "School ID" },
    { key: "gateway_name", label: "Gateway Name" },
    { key: "order_amount", label: "Order Amount" },
    { key: "transaction_amount", label: "Transaction Amount" },
    { key: "status", label: "Status" },
  ];

  // Debounce input → set schoolId after 500ms of no typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setSchoolId(schoolInput.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [schoolInput]);

  // Fetch transactions whenever debounced schoolId changes
  useEffect(() => {
    if (!schoolId) {
      setTransactions([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchTransactionsBySchool(schoolId);
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolId]);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center md:text-left">
        Search Transactions by School ID
      </h2>

      {/* School ID Input */}
      <div className="mb-6 flex justify-center md:justify-start">
        <input
          type="text"
          placeholder="Enter School ID"
          value={schoolInput}
          onChange={(e) => setSchoolInput(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-300">
          Loading transactions...
        </div>
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <Table
            data={transactions}
            columns={columns}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-md"
            rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          />
        </div>
      ) : schoolId ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No transactions found for school <span className="font-semibold">{schoolId}</span>.
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          Enter a School ID to see transactions.
        </div>
      )}
    </div>
  );
};

export default SchoolTransactions;
