import React, { useEffect, useState } from 'react';
import styles from './Finance.module.css';
import DefaultLayout from "../../layout/DefaultLayout";
import { getDistricts } from '../../services/districtService';

const TableComponent = () => {
  const initialData = [
    { id: 1, name: 'Jaffna', expense: 10500, pending: 500 },
    { id: 2, name: 'Vavuniya', expense: 5700, pending: 4500 },
    { id: 3, name: 'Colombo', expense: 21450, pending: 15000 }
  ];

  const [data, setData] = useState([]);


  useEffect(() => {
    getDistricts().then(data => {
      console.log("received data", data);
      setData(data);
    })
    console.log("Called the backend");
  }, []);


  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof initialData[0], direction: 'asc' | 'desc' } | null>(null);

  const headers: { key: keyof typeof initialData[0], label: string }[] = [
    { key: 'id', label: 'No' },
    { key: 'name', label: 'District' },
    { key: 'expense', label: 'Expense' },
    { key: 'pending', label: 'Pending' },
  ];

  const handleSort = (key: keyof typeof initialData[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
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

  const getSortSymbol = (key: keyof typeof initialData[0]) => {
    if (!sortConfig || sortConfig.key !== key) return '↕'; // default: neutral arrow
    return sortConfig.direction === 'asc' ? '↑' : '↓'; // up or down arrow
  };
  

  return (
    <DefaultLayout>
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {headers.map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {label}
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {getSortSymbol(key)}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((district) => (
                  <tr key={district.id}>
                    <td>{district.id}</td>
                    <td>{district.name}</td>
                    <td>{district.expense}</td>
                    <td>{district.pending}</td>
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
