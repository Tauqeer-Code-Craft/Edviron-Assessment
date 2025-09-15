import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTransactions } from "../services/api";
import { Calendar, Copy } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [date, setDate] = useState("");
  const [sortField, setSortField] = useState("payment_time");
  const [sortOrder, setSortOrder] = useState("desc");
  const [toast, setToast] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status") || "";
    const school = searchParams.get("school")?.split(",") || [];
    const selectedDate = searchParams.get("date") || "";
    const sortF = searchParams.get("sortField") || "payment_time";
    const sortO = searchParams.get("sortOrder") || "desc";

    setSelectedStatus(status);
    setSelectedSchools(school);
    setDate(selectedDate);
    setSortField(sortF);
    setSortOrder(sortO);
  }, []);

  useEffect(() => {
    const params = {};
    if (selectedStatus) params.status = selectedStatus;
    if (selectedSchools.length) params.school = selectedSchools.join(",");
    if (date) params.date = date;
    if (sortField) params.sortField = sortField;
    if (sortOrder) params.sortOrder = sortOrder;
    setSearchParams(params);
  }, [selectedStatus, selectedSchools, date, sortField, sortOrder]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchTransactions({
          status: selectedStatus,
          school: selectedSchools.join(","),
          date,
          sortField,
          sortOrder,
        });
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedStatus, selectedSchools, date, sortField, sortOrder]);

  const toggleSchool = (school) => {
    setSelectedSchools((prev) =>
      prev.includes(school) ? prev.filter((s) => s !== school) : [...prev, school]
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToast(`Copied: ${text}`);
    setTimeout(() => setToast(""), 2000);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  return (
    <div className="max-w-7xl mx-auto mt-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl relative">
      {toast && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md animate-slide-in">
          {toast}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Enter School ID"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value) {
                toggleSchool(e.target.value);
                e.target.value = "";
              }
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={18} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSchools.map((school) => (
          <span
            key={school}
            onClick={() => toggleSchool(school)}
            className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-full text-sm shadow-sm hover:bg-blue-700 transition"
          >
            {school} ×
          </span>
        ))}
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
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="py-3 px-4 border-b">Sr No</th>
                <th className="py-3 px-4 border-b">School ID</th>
                <th className="py-3 px-4 border-b">Order ID</th>
                <th className="py-3 px-4 border-b">Order Amount</th>
                <th className="py-3 px-4 border-b">Transaction Amount</th>
                <th className="py-3 px-4 border-b">Payment Method</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Collect ID</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {transactions.map((tx, idx) => (
                <tr
                  key={tx.collect_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-2 px-4 border-b">{idx + 1}</td>
                  <td className="py-2 px-4 border-b">{tx.school_id}</td>
                  <td
                    className="py-2 px-4 border-b cursor-pointer flex items-center gap-1 hover:text-blue-600 "
                    onClick={() => copyToClipboard(tx.custom_order_id)}
                    title={tx.custom_order_id}
                  >
                    {tx.custom_order_id.length > 8 
                    ? `${tx.custom_order_id.slice(0,6)}...${tx.custom_order_id.slice(-2)}`
                    : tx.custom_order_id
                    } 
                    <Copy size={16} />
                  </td>
                  <td className="py-2 px-4 border-b">{formatCurrency(tx.order_amount)}</td>
                  <td className="py-2 px-4 border-b">{formatCurrency(tx.transaction_amount)}</td>
                  <td className="py-2 px-4 border-b">{tx.gateway_name}</td>
                  <td className="py-2 px-4 border-b capitalize">{tx.status}</td>
                  <td
                    className="py-2 px-4 border-b cursor-pointer flex items-center gap-1 hover:text-blue-600"
                    onClick={() => copyToClipboard(tx.collect_id)}
                    title={tx.collect_id}
                  >
                    {tx.collect_id.length>8
                    ?  `${tx.collect_id.slice(0,10)}...${tx.collect_id.slice(-3)}`
                    : tx.collect_id
                    } <Copy size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
