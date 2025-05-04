import { useState } from 'react';
import DefaultLayout from "../../layout/DefaultLayout";

interface District {
  id: number;
  name: string;
  expense: number;
  pending: number;
}

const TableComponent = () => {
  const [data, setData] = useState<Array<District>>([
    { id: 1, name: 'Jaffna', expense: 10500, pending: 500 },
    { id: 2, name: 'Vavuniya', expense: 5700, pending: 4500 },
    { id: 3, name: 'Colombo', expense: 21450, pending: 15000 }
  ]);

  const [sortConfig, setSortConfig] = useState<{ key: keyof District, direction: 'asc' | 'desc' } | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const headers: { key: keyof District, label: string }[] = [
    { key: 'id', label: 'No' },
    { key: 'name', label: 'District' },
    { key: 'expense', label: 'Expense' },
    { key: 'pending', label: 'Pending' },
  ];

  const handleSort = (key: keyof District) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const getSortSymbol = (key: keyof District) => {
    if (!sortConfig || sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <DefaultLayout>
      <div className="mb-5.5">
        <select
          className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          name="selectItemsPerPage"
          id="selectItemsPerPage"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="100">100</option>
          <option value="500">500</option>
        </select>
      </div>

      <div className="flex flex-col gap-10">
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse bg-white text-left text-sm text-black dark:bg-boxdark dark:text-white">
            <thead className="bg-gray-200 dark:bg-meta-4">
              <tr>
                {headers.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer px-4 py-3 font-semibold"
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <span className="text-xs text-gray-500">{getSortSymbol(key)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, itemsPerPage).map((district) => (
                <tr
                  key={district.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                >
                  <td className="px-4 py-2">{district.id}</td>
                  <td className="px-4 py-2">{district.name}</td>
                  <td className="px-4 py-2">{district.expense}</td>
                  <td className="px-4 py-2">{district.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TableComponent;
