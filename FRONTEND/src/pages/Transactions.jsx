import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTransactions } from "../services/api";
import { Calendar, Copy } from "lucide-react";

const DEMO_TRANSACTIONS = [
  {
    collect_id: "demoCollect001",
    school_id: "school_demo_001",
    custom_order_id: "demoOrder001",
    order_amount: 1000,
    transaction_amount: 1050,
    gateway_name: "PhonePe",
    status: "success",
    payment_time: "2025-09-10T10:00:00.000Z",
  },
];

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
        setTransactions(res.data && res.data.length ? res.data : []);
      } catch (err) {
        console.error(err);
        setTransactions([]);
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

  const displayTransactions = transactions.length ? transactions : DEMO_TRANSACTIONS;

  return (
    <div className="max-w-7xl mx-auto mt-4 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-xl relative">
      {toast && (
  <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md animate-fade-in">
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
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-zinc-200 placeholder-zinc-400"
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
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-zinc-200"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-300" size={18} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-zinc-200"
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

      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
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
          <tbody className="text-zinc-800 dark:text-zinc-200">
            {displayTransactions.map((tx, idx) => (
              <tr
                key={tx.collect_id + idx}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <td className="py-2 px-4 border-b">{idx + 1}</td>
                <td className="py-2 px-4 border-b">{tx.school_id}</td>
                <td
                  className="py-2 px-4 border-b cursor-pointer flex items-center gap-1 hover:text-blue-600"
                  onClick={() => copyToClipboard(tx.custom_order_id)}
                  title={tx.custom_order_id}
                >
                  {tx.custom_order_id.length > 8
                    ? `${tx.custom_order_id.slice(0, 6)}...${tx.custom_order_id.slice(-2)}`
                    : tx.custom_order_id}
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
                  {tx.collect_id.length > 8
                    ? `${tx.collect_id.slice(0, 10)}...${tx.collect_id.slice(-3)}`
                    : tx.collect_id}
                  <Copy size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!transactions.length && (
          <div className="text-center text-sm italic text-zinc-500 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-b-xl">
            Showing demo data (no real transactions available)
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
