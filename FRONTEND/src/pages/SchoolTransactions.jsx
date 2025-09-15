import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTransactionsBySchool } from "../services/api";
import Table from "../components/Table.jsx";

const SchoolTransactions = () => {
  const { schoolId } = useParams();
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

  useEffect(() => {
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
        Transactions for School:{" "}
        <span className="text-blue-600 dark:text-blue-400">{schoolId}</span>
      </h2>

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
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No transactions found for this school.
        </div>
      )}
    </div>
  );
};

export default SchoolTransactions;
