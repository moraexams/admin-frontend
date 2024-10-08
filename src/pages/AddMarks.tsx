import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import Snackbar from '../components/Snackbar';
import { SnackBarConfig } from '../types/snackbar';
import { useSearchParams } from 'react-router-dom';
import { enterMark, getStudentMarksData } from '../services/markservices';

const AddMarks = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Default values
    const defaultSubject = "s1";
    const defaultPart = "p1";

    // Set state for subject and part
    const [selectDisabled, setSelectDisabled] = useState(true);
    const subjects = ["s1", "s2", "s3"];
    const parts = ["p1", "p2"];

    const [subject, setSubject] = useState(searchParams.get("subject") || defaultSubject);
    const [part, setPart] = useState(searchParams.get("part") || defaultPart);

    // Update URL query params when component mounts or when subject/part state changes
    useEffect(() => {
        if (!searchParams.get("subject") || !searchParams.get("part")) {
            // Update URL if the query parameters are not present
            setSearchParams({ subject, part });
        }
        if (!subjects.includes(subject) || !parts.includes(part)) {
            // Update URL if the query parameters are invalid
            setSearchParams({ subject: defaultSubject, part: defaultPart });
            setSubject(defaultSubject);
            setPart(defaultPart);
        }
    }, [subject, part, searchParams, setSearchParams]);

    // Handle changes in the subject select
    const handleSubjectChange = (event: { target: { value: any; }; }) => {
        const newSubject = event.target.value;
        setSubject(newSubject);
        setSearchParams({ subject: newSubject, part });
    };

    // Handle changes in the part select
    const handlePartChange = (event: { target: { value: any; }; }) => {
        const newPart = event.target.value;
        setPart(newPart);
        setSearchParams({ subject, part: newPart });
    };
    const [indexNo, setIndexNo] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [mark, setMark] = useState<number>(0);

    const handleSubmit = async () => {
        if (indexNo < 100000 || indexNo > 360000) {
            showSnackBar(false, "Invalid Index No");
            return;
        }
        if (mark < 0 || mark > 100) {
            showSnackBar(false, "Invalid Mark");
            return;
        }

        // Call the API to add the mark
        await enterMark(indexNo, subject, part, mark).then(() => {
            showSnackBar(true, "Mark Added Successfully");
        }).catch((error) => {
            showSnackBar(false, error);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            if (indexNo < 100000 || indexNo > 360000) {
                setName('Student Not Found');
                setMark(0);
                return
            };
            const studentMarks = await getStudentMarksData(indexNo);
            if (studentMarks) {
                setName(studentMarks.name);
                if (studentMarks[`${subject}_${part}`]) {
                    setMark(studentMarks[`${subject}_${part}`]);
                } else {
                    setMark(0);
                }
            } else {
                setName('Student Not Found');
                setMark(0);
            };
        };

        fetchData();
    }, [indexNo, subject, part]);

    const [snackBarConfig, setSnackBarConfig] = useState<SnackBarConfig>({
        message: '',
        type: false,
        show: false
    });

    const showSnackBar = (type: boolean, message: string) => {
        setSnackBarConfig({ message: message, type: type, show: true });
        setTimeout(() => {
            setSnackBarConfig(prev => ({ ...prev, show: false }));
        }, 1000);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Add Student' />
            <div className="w-full rounded-lg bg-white px-8 py-6 mt-6 dark:bg-boxdark md:px-17.5 md:py-8">
                <div>
                    <div className="flex flex-wrap gap-x-4">
                        <div className="mb-5.5">
                            <select
                                className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                name="subject"
                                value={subject}
                                onChange={handleSubjectChange}
                                disabled={selectDisabled}
                            >
                                <option value="s1">Math/Bio</option>
                                <option value="s2">Physics</option>
                                <option value="s3">Chem/ICT</option>
                            </select>
                        </div>
                        <div className="mb-5.5">
                            <select
                                className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                name="part"
                                value={part}
                                onChange={handlePartChange}
                                disabled={selectDisabled}
                            >
                                <option value="p1">Part 1</option>
                                <option value="p2">Part 2</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => setSelectDisabled(!selectDisabled)}
                                className="block rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                                {selectDisabled ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                }
                            </button>
                        </div>
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Index No <span className="text-meta-1">*</span>
                        </label>
                        <input
                            type="text"
                            value={indexNo}
                            onChange={(e) =>
                                setIndexNo(Number(e.target.value))
                            }
                            placeholder="Enter Index No"
                            inputMode="numeric"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Student Name
                        </label>
                        <input
                            disabled
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Student Name"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Marks <span className="text-meta-1">*</span>
                        </label>
                        <input
                            type="text"
                            value={mark}
                            onChange={(e) =>
                                setMark(Number(e.target.value))
                            }
                            placeholder="Enter Index No"
                            inputMode="numeric"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>
                <div className="w-full px-3 pt-4">
                    <button onClick={handleSubmit} className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                        Add Marks
                    </button>
                </div>

            </div>

            <Snackbar config={snackBarConfig} />
        </DefaultLayout>
    );
}

export default AddMarks;