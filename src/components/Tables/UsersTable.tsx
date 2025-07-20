import { useEffect, useRef, useState } from "react";
import {
	ROLE_DISTRICTS_COORDINATOR,
	ROLE_EXAM_COORDINATOR,
	ROLE_FINANCE_TEAM_MEMBER,
	ROLE_MARKETING_COORDINATOR,
	ROLE_NONE,
	ROLE_PRESIDENT,
	ROLE_SECRETARY,
	ROLE_TREASURER,
	ROLE_USER,
	ROLE_VICE_PRESIDENT,
	ROLE_VICE_SECRETARY,
} from "../../common/roles";
import { capitalize } from "../../common/utils";
import { editUser } from "../../services/userService";
import type { User } from "../../types/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
	year: "numeric",
	month: "short",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
});

interface UsersTableProps {
	total: number;
	userData: User[];
	page: number;
	itemsPerPage: number;
	refetch: () => void;
}

const AVAILABLE_ROLES_FOR_SETTING = [
	ROLE_PRESIDENT,
	ROLE_VICE_PRESIDENT,
	ROLE_SECRETARY,
	ROLE_VICE_SECRETARY,
	ROLE_TREASURER,
	ROLE_DISTRICTS_COORDINATOR,
	ROLE_EXAM_COORDINATOR,
	ROLE_MARKETING_COORDINATOR,
	ROLE_FINANCE_TEAM_MEMBER,
	ROLE_USER,
] as const;

const UsersTable = ({
	total,
	userData,
	page,
	itemsPerPage,
	refetch,
}: UsersTableProps) => {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const dialogElementRef = useRef<HTMLDialogElement | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateUser = async () => {
		if (!selectedUser) return;
		setIsLoading(true);
		try {
			await editUser(selectedUser);
			setSelectedUser(null);
			refetch();
		} catch (error) {
			if (typeof error === "string") {
				setError(error);
			} else {
				setError("Unknown error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const start = itemsPerPage * (page - 1) + 1;
	const end = start - 1 + userData.length;

	useEffect(() => {
		if (!dialogElementRef.current) return;
		if (selectedUser) {
			dialogElementRef.current.showModal();
		} else {
			dialogElementRef.current.close();
		}
	}, [selectedUser]);

	return (
		<>
			<dialog
				ref={dialogElementRef}
				className="px-10 py-6 rounded-md dark:bg-boxdark-2 bg-body min-w-[500px] max-w-[90vw]"
			>
				{selectedUser == null ? (
					<span>No user selected</span>
				) : (
					<>
						<h3 className="text-2xl mb-2 font-medium">Edit User</h3>
						<p className="mb-5">
							You are editing the user: <b>{selectedUser.username}</b>.<br />{" "}
							You cannot edit their username or name.
						</p>

						<div className="grid grid-cols-[1fr_auto] items-center mb-4">
							<label
								htmlFor="approved-status"
								className="cursor-pointer font-semibold"
							>
								Approved
							</label>
							<p>Only approved members can login.</p>
							<input
								type="checkbox"
								id="approved-status"
								className="size-5 cursor-pointer col-start-2 row-start-1 row-span-2"
								checked={selectedUser.approved}
								onChange={(e) => {
									setSelectedUser({
										...selectedUser,
										approved: e.target.checked,
									});
								}}
							/>
						</div>

						<div className="grid grid-cols-[1fr_auto] items-center mb-4">
							<label htmlFor="select-role" className="font-semibold">
								Role
							</label>
							<p>Controls how much the user can do.</p>
							<select
								className="rounded border border-stroke bg-white py-2 px-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary cursor-pointer col-start-2 row-start-1 row-span-2"
								id="select-role"
								value={selectedUser.role}
								onChange={(e) => {
									setSelectedUser({ ...selectedUser, role: e.target.value });
								}}
							>
								{AVAILABLE_ROLES_FOR_SETTING.map((role) => (
									<option key={role} value={role}>
										{role}
									</option>
								))}
							</select>
						</div>
						<div className="flex gap-3">
							<span className="mr-auto">
								{isLoading ? "Loading..." : error == null ? "" : error}
							</span>
							<button
								type="button"
								className="px-4 py-1.5 rounded-md bg-red-500 hover:bg-red-600"
								onClick={() => {
									setSelectedUser(null);
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								className="rounded-md hover:bg-gray transition-colors hover:text-black px-4 py-1.5 border"
								onClick={updateUser}
							>
								Save
							</button>
						</div>
					</>
				)}
			</dialog>
			<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
				<div className="max-w-full overflow-x-auto">
					<table className="w-full table-auto">
						<thead>
							<tr className="bg-gray-2 text-left dark:bg-meta-4">
								<th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
									User ID
								</th>
								<th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
									Username
								</th>
								<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
									Name
								</th>
								<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
									Created At
								</th>
								<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
									Approved
								</th>
								<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
									Role
								</th>
								<th className="py-4 px-4 font-medium text-black dark:text-white">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{userData?.map((user) => (
								<tr key={user.id}>
									<td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
										<h5 className="font-medium text-black dark:text-white">
											{user.id}
										</h5>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
										<p className="text-black dark:text-white">
											{user.username}
										</p>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
										<p className="text-black dark:text-white">{user.name}</p>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
										<p className="text-black dark:text-white">
											{dateFormatter.format(new Date(user.created_at))}
										</p>
									</td>

									<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
										<p className="text-black dark:text-white">
											{user.approved ? "Yes" : "No"}
										</p>
									</td>
									<td>
										<span className="text-black dark:text-white">
											{capitalize(user.role).replaceAll("_", " ")}
										</span>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
										<div className="flex items-center space-x-3.5">
											<button
												type="button"
												onClick={() => {
													setSelectedUser(user);
												}}
												className="hover:text-primary"
												title="Edit user"
											>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
												>
													<path stroke="none" d="M0 0h24v24H0z" fill="none" />
													<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
													<path d="M13.5 6.5l4 4" />
												</svg>
											</button>

											<button type="button" className="hover:text-primary">
												<svg
													className="fill-current"
													width="18"
													height="18"
													viewBox="0 0 18 18"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
														fill=""
													/>
													<path
														d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
														fill=""
													/>
													<path
														d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
														fill=""
													/>
													<path
														d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
														fill=""
													/>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex flex-wrap justify-between my-2">
					<div className="flex items-center my-2">
						Showing {start} to {end} out of {total}
					</div>
				</div>
			</div>
		</>
	);
};

export default UsersTable;
