const Table = ({ data = [], columns = [] }) => {
  const getValue = (obj, key) =>
    key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 dark:border-gray-700 text-sm text-left">
        {/* Table Header */}
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-xs uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length ? (
            data.map((row, i) => (
              <tr
                key={row.custom_order_id || i}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {getValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center px-4 py-6 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
