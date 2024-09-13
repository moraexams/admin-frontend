import { useState, useEffect } from 'react';
import { getStudents } from '../services/studentService';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { Student } from '../types/types';

import StudentTable  from '../components/Tables/StudentTable';

const Students = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [searchKey, setSearchKey] = useState<string>('');

    useEffect(()=> {
        const fetchStudents = async () => {
            try {
                const students = await getStudents();
                setStudents(students);
            } catch (error) {
                setError("Failed to fetch Students");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    },[]);

    if (error) {
        return <div>{error}</div>
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName='Students' />
            <div className="flex gap-4">
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

export default Students;