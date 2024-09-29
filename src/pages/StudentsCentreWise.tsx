import { useState, useEffect } from 'react';
import { getStudentsByCentre } from '../services/studentService';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { District, Student } from '../types/types';

import StudentTable from '../components/Tables/StudentTable';
import { getDistrictsWithCentres } from '../services/districtService';

const StudentsCentreWise = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [searchKey, setSearchKey] = useState<string>('');

    const [districts, setDistricts] = useState<District[]>([]);
    const [district, setDistrict] = useState<number>(1);
    const [centre, setCentre] = useState<number>(1);

    const handleDistrictSelect = (districtId: number) => {
        setDistrict(districtId);
        const firstCentre = districts.find((d) => d.id === districtId)?.exam_centres?.[0];
        console.log(firstCentre);
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
                const students = await getStudentsByCentre(centre);
                setStudents(students);
            } catch (error) {
                setError("Failed to fetch Students");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [district, centre]);
    if (error) {
        return <div>{error}</div>;
    }
    if (error) {
        return <div>{error}</div>
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName='Students' />
            <div className="flex flex-wrap gap-x-4">
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
                <div className="mb-4.5">
                    <input
                        type="text"
                        value={searchKey}
                        onChange={(e) =>
                            setSearchKey(e.target.value)
                        }
                        placeholder="Search..."
                        className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-10">
                {loading ? <div>Loading...</div> : <StudentTable studentData={students} nameSearchKey={searchKey} itemsPerPage={itemsPerPage} />}
            </div>
        </DefaultLayout>
    );
}

export default StudentsCentreWise;