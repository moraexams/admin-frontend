import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { District } from '../types/types';
import { getDistricts } from '../services/districtService';
import DistrictsTable from '../components/Tables/DistrictsTable';

const Districts = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districts = await getDistricts();
        setDistricts(districts);
      } catch (error) {
        setError('Failed to fetch districts');
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Districts" />

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
        {loading ? <div>Loading...</div> : <DistrictsTable districtData={districts} itemsPerPage={itemsPerPage} />}
      </div>
    </DefaultLayout>
  );
};

export default Districts;
