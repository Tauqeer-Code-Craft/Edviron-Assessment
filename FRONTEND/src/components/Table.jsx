const Table = ({ data = [], columns = [] }) => {
  const getValue = (obj, key) => key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "";

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full min-w-max text-left border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-gray-700 dark:text-gray-200 font-medium text-sm tracking-wide uppercase"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((row, i) => (
              <tr
                key={row.custom_order_id || i}
                className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm"
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
                className="text-center px-6 py-6 text-gray-500 dark:text-gray-400"
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
