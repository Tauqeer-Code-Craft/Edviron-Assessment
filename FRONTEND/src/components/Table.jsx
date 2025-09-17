const Table = ({ data = [], columns = [] }) => {
  const getValue = (obj, key) =>
    key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-zinc-300 dark:border-zinc-700 text-sm text-left">
        {/* Table Header */}
        <thead className="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold text-xs uppercase tracking-wide"
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
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
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
                className="text-center px-4 py-6 border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
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
