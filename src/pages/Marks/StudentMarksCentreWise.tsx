import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import StudentMarksTable from "../../components/Tables/StudentMarksTable";
import DefaultLayout from "../../layout/DefaultLayout";
import { getDistrictsWithCentres } from "../../services/districtService";
import { getStreams } from "../../services/streamServices";
import { getStudentMarksByCentre } from "../../services/studentService";
import type { District, Stream, StudentMark } from "../../types/types";

const StudentMarksCentreWise = () => {
	const [students, setStudents] = useState<StudentMark[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [searchKey, setSearchKey] = useState<string>("");

	const [districts, setDistricts] = useState<District[]>([]);
	const [district, setDistrict] = useState<number>(1);
	const [centre, setCentre] = useState<number>(1);
	const [streams, setStreams] = useState<Stream[]>([]);
	const [stream, setStream] = useState<number>(-1);

	const handleDistrictSelect = (districtId: number) => {
		setDistrict(districtId);
		const firstCentre = districts.find((d) => d.id === districtId)
			?.exam_centres?.[0];
		console.log(firstCentre);
		setCentre(firstCentre?.id || 1);
	};
	useEffect(() => {
		const fetchDistricts = async () => {
			try {
				const districts = await getDistrictsWithCentres();
				const streams = await getStreams();
				setDistricts(districts);
				setStreams(streams);
			} catch (error) {
				setError("Failed to fetch districts");
			} finally {
				setLoading(false);
			}
		};

		fetchDistricts();
	}, []);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const students = await getStudentMarksByCentre(centre, stream);
				setStudents(students);
			} catch (error) {
				setError("Failed to fetch Students");
			} finally {
				setLoading(false);
			}
		};
		fetchStudents();
	}, [district, centre, stream]);
	if (error) {
		return <div>{error}</div>;
	}
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Student Marks" />
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
						{districts.map((district) => {
							return (
								<option key={district.id} value={district.id}>
									{district.name}
								</option>
							);
						})}
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
									{centre.name.length > 32
										? `${centre.name.substring(0, 30)}...`
										: centre.name}
								</option>
							))}
					</select>
				</div>
				<div className="mb-5.5">
					<select
						className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
						name="selectStream"
						id="selectStream"
						value={stream}
						onChange={(e) => setStream(Number(e.target.value))}
					>
						<option value="-1">All</option>
						{streams.map((stream) => {
							return (
								<option key={stream.id} value={stream.id}>
									{stream.name.substring(0, 3)}
								</option>
							);
						})}
					</select>
				</div>
				<div className="mb-4.5">
					<input
						type="text"
						value={searchKey}
						onChange={(e) => setSearchKey(e.target.value)}
						placeholder="Search..."
						className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-10">
				{loading ? (
					<div>Loading...</div>
				) : (
					<StudentMarksTable
						studentData={students}
						nameSearchKey={searchKey}
						itemsPerPage={itemsPerPage}
					/>
				)}
			</div>
		</DefaultLayout>
	);
};

export default StudentMarksCentreWise;
