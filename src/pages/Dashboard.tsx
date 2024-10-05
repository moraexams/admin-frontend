import React, { useEffect, useState } from 'react';
import CardDataStats from '../components/CardDataStats';
import DefaultLayout from '../layout/DefaultLayout';
import { getStatCounts, getStatsByCentre } from '../services/statsServices';
import { getDistrictsWithCentres } from '../services/districtService';
import { District } from '../types/types';

const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [districts, setDistricts] = useState<District[]>([]);
  const [district, setDistrict] = useState<number>(1);
  const [centre, setCentre] = useState<number>(1);
  const [centreStats, setCentreStats] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const counts = await getStatCounts();
        setCounts(counts);
      } catch (error) {
        setError('Failed to fetch counts');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleDistrictSelect = (districtId: number) => {
    setDistrict(districtId);
    const firstCentre = districts.find((d) => d.id === districtId)?.exam_centres?.[0];
    setCentre(firstCentre?.id || 1);
  }
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districts = await getDistrictsWithCentres();
        setDistricts(districts);
      } catch (error) {
        setError('Failed to fetch districts');
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const stats = await getStatsByCentre(centre);
        setCentreStats(stats);
      } catch (error) {
        setError("Failed to fetch centres");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [district, centre]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DefaultLayout>
      {/* <div>
        <h1 className="text-3xl font-semibold text-primary">Dashboard on progress...</h1>
      </div> */}
      {loading ? <div>Loading...</div> :
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <CardDataStats title="Total Students" total={counts.student}>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>


            </CardDataStats>
            <CardDataStats title="Total Centers" total={counts.exam_center}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>

            </CardDataStats>
            <CardDataStats title="Total Coordinators" total={counts.coordinator}>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
              </svg>


            </CardDataStats>
            <CardDataStats title="Total Users" total={counts.user}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </CardDataStats>
          </div>

          <div className="mt-4 grid grid-cols-16 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-black dark:text-white">
                    Centre Wise Stats
                  </h2>
                </div>
                <div className="flex flex-wrap gap-x-4">
                  <div className="mb-5.5">
                    <select
                      className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="selectDistrict"
                      id="selectDistrict"
                      value={district.toString()}
                      onChange={(e) => handleDistrictSelect(Number(e.target.value))}
                    >
                      {
                        districts.map((district) => { return (<option key={district.id} value={district.id}>{district.name}</option>) })
                      }
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <select
                      className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="selectCentre"
                      id="selectCentre"
                      value={centre.toString()}
                      onChange={(e) => setCentre(Number(e.target.value))}
                    >
                      {districts
                        .find((d) => d.id === district)
                        ?.exam_centres?.map((centre) => (
                          <option key={centre.id} value={centre.id}>
                            {centre.name.length > 32 ? `${centre.name.substring(0, 30)}...` : centre.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="max-w-full overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4 font-bold">
                        <th className="min-w-[80px] py-4 px-4 text-black dark:text-white xl:pl-11">
                          Stream
                        </th>
                        <th className="min-w-[150px] py-4 px-4 text-black dark:text-white">
                          Males
                        </th>
                        <th className="min-w-[120px] py-4 px-4 text-black dark:text-white">
                          Females
                        </th>
                        <th className="min-w-[120px] py-4 px-4 text-black dark:text-white">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {centreStats.counts &&
                          centreStats.counts.map((count: any, key: number) => (
                            <tr key={key}>
                              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                <h5 className="font-medium text-black dark:text-white">
                                  {count.stream_name}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">
                                  {count.male_count}
                                </p>
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">
                                  {count.female_count}
                                </p>
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="font-semibold text-black dark:text-white">
                                  {count.total_count}
                                </p>
                              </td>
                            </tr>
                          ))}
                        <tr className="font-semibold">
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="text-black dark:text-white">
                              <strong>Total</strong>
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {centreStats.total_male}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {centreStats.total_female}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="font-bold text-primary dark:text-white">
                              <strong>{centreStats.total_male + centreStats.total_female}</strong>
                            </p>
                          </td>
                        </tr>
                      </>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>}
    </DefaultLayout>
  );
};

export default Dashboard;
