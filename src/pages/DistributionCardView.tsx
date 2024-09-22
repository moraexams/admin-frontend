import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { District } from '../types/types';
import ExamPaperDistributionCard from '../components/Cards/ExamPaperDistributionCard';
import { getDistributions } from '../services/distributionService';


const ExamPaperDistributionCardView = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [district, setDistrict] = useState<Number>(1);
  const [centre, setCentre] = useState<Number>(-1);

  const handleDistrictSelect = (districtId: Number) => {
    setDistrict(districtId);
    setCentre(-1);
  }
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districts = await getDistributions();
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
      <Breadcrumb pageName="Exam Paper Distribution Card View" />
      <div className="flex gap-4">
        <div className="mb-5.5">
          <label htmlFor="selectCentre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select District
          </label>
          <select
            className="block w-full border border-gray-300 bg-white dark:bg-slate-800 dark:border-gray-600 text-black dark:text-white py-2 px-3 focus:outline-none focus:ring focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
            name="selectDistrict"
            id="selectDistrict"
            value={district.toString()}
            onChange={(e) => handleDistrictSelect(Number(e.target.value))}
          >
            {
              districts.map((district) => { return (<option value={district.id}>{district.name}</option>) })
            }
          </select>
        </div>
        <div className="mb-5.5">
          <label htmlFor="selectCentre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Centre
          </label>
          <select
            className="block w-full border border-gray-300 bg-white dark:bg-slate-800 dark:border-gray-600 text-black dark:text-white py-2 px-3 focus:outline-none focus:ring focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
            name="selectCentre"
            id="selectCentre"
            value={centre.toString()}
            onChange={(e) => setCentre(Number(e.target.value))}
          >
            <option value="-1">All</option>
            {districts
              .find((d) => d.id === district)
              ?.exam_centres?.map((centre) => (
                <option key={centre.id} value={centre.id}>
                  {centre.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {loading ? <div>Loading...</div> : <ExamPaperDistributionCard districtData={districts} district={district} centre={centre} />}
      </div>
    </DefaultLayout>
  );
};

export default ExamPaperDistributionCardView;
