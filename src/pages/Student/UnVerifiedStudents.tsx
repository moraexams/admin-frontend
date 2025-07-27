import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import UnVerifiedStudentTable from "../../components/Tables/UnVerifiedStudentTable";
import DefaultLayout from "../../layout/DefaultLayout";
import { getUnVerifiedStudents } from "../../services/studentService";
import { getUsers } from "../../services/userService";
import type { Student, User } from "../../types/types";

const UnVerifiedStudents = () => {
	// const currentUser = Number(localStorage.getItem('user_id')) || 1;
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [searchKey, setSearchKey] = useState<string>("");
	const [user, setUser] = useState<number>(-1);
	const [users, setUsers] = useState<User[]>([]);

	const handleUserSelect = (userId: number) => {
		setUser(userId);
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await getUsers(1, 10);
				console.log(data);
				setUsers(data.users);
			} catch (error) {
				setError("Failed to fetch Students");
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const students = await getUnVerifiedStudents();
				setStudents(students);
			} catch (error) {
				setError("Failed to fetch Students");
			} finally {
				setLoading(false);
			}
		};
		fetchStudents();
	}, []);

	if (error) {
		return <div>{error}</div>;
	}
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Students" />
			<div className="flex gap-4">
				<div className="mb-5.5">
					<select
						className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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
						className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
						name="selectDistrict"
						id="selectDistrict"
						value={user.toString()}
						onChange={(e) => handleUserSelect(Number(e.target.value))}
					>
						<option value="-1">All</option>
						{users.map((user) => {
							return (
								<option key={user.id} value={user.id}>
									{user.username}
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
						className="w-full rounded-sm border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-10">
				{loading ? (
					<div>Loading...</div>
				) : (
					<UnVerifiedStudentTable
						studentData={students}
						nameSearchKey={searchKey}
						itemsPerPage={itemsPerPage}
						userId={user}
					/>
				)}
			</div>
		</DefaultLayout>
	);
};

export default UnVerifiedStudents;
