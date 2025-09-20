import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import Snackbar from "../../components/Snackbar";
import { getDistrictsWithCentres } from "../../services/districtService";
import { getCenters } from "../../services/examCentreService";
import { getStreams } from "../../services/streamServices";
import { addStudent } from "../../services/studentService";
// import type { SnackBarConfig } from "../../types/snackbar";
import type { District, ExamCentre, Stream } from "../../types/types";

const AddStudent = () => {
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [streamId, setStreamId] = useState<number>(1);
	const [medium, setMedium] = useState<string>("Tamil");
	const [rankDistrictId, setRankDistrictId] = useState<number>(1);
	const [examDistrictId, setExamDistrictId] = useState<number>(1);
	const [centreId, setCentreId] = useState<number>(1);
	const [nic, setNic] = useState<string>("");
	const [gender, setGender] = useState<string>("Male");
	const [school, setSchool] = useState<string>("");
	const [address, setAddress] = useState<string>("");

	const [centersDistricts, setCentersDistricts] = useState<District[]>([]);
	// const [currDistCenters, setCurrDistCenters] = useState<ExamCentre[]>([]);
	const [streams, setStreams] = useState<Stream[]>([]);
	const [centers, setCenters] = useState<ExamCentre[]>([]);
	const [currCenters, setCurrCenters] = useState<ExamCentre[]>([]);

	const handleSubmit = async () => {
		if (
			name !== "" &&
			streamId &&
			rankDistrictId &&
			examDistrictId &&
			centreId &&
			nic !== "" &&
			medium !== "" &&
			gender !== ""
		) {
			addStudent(
				name,
				streamId,
				medium,
				rankDistrictId,
				examDistrictId,
				centreId,
				nic,
				gender,
				email,
				phone,
				school,
				address,
			)
				.then(() => {
					// showSnackBar(true, "Student Added");
					toast.success("Student Added Successfully");

					setName("");
					setEmail("");
					setPhone("");
					setSchool("");
					setAddress("");
					setNic("");
				})
				.catch((error) => {
					// showSnackBar(false, error);
					toast.error(`Failed to add student: ${error.message}`);
				});
		} else {
			// showSnackBar(false, "Fill all fields");
			toast.error("Please fill all required fields");
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const Distcenters = await getDistrictsWithCentres();
				const centers = await getCenters();
				const streams = await getStreams();
				setCentersDistricts(Distcenters);
				setCenters(centers);
				setStreams(streams);
				const currentCenters = centers.filter(
					(center: { district_id: number }) =>
						center.district_id === examDistrictId,
				);
				setCurrCenters(currentCenters);
				setCentreId(currentCenters[0].id);
			} catch (error) {
				console.log("Failed to fetch data", error);
			}
		};

		fetchData();
	}, []);
	useEffect(() => {
		const setCenters = async () => {
			try {
				const currentCenters = centers.filter(
					(center) => center.district_id === examDistrictId,
				);
				setCurrCenters(currentCenters);
				setCentreId(currentCenters[0]?.id ? currentCenters[0].id : 77); //make it return error
			} catch (error) {
				console.log("Failed to fetch data", error);
			}
		};

		setCenters();
	}, [examDistrictId]);

	// const [snackBarConfig, setSnackBarConfig] = useState<SnackBarConfig>({
	// 	message: "",
	// 	type: false,
	// 	show: false,
	// });

	// const showSnackBar = (type: boolean, message: string) => {
	// 	setSnackBarConfig({ message: message, type: type, show: true });
	// 	setTimeout(() => {
	// 		setSnackBarConfig((prev) => ({ ...prev, show: false }));
	// 	}, 1000);
	// };
	return (
		<>
			<Breadcrumb pageName="Add Student" />
			<div className="w-full rounded-lg px-8 py-6 mt-6  md:px-17.5 md:py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Student Name <span className="text-meta-1">*</span>
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter Student Name"
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							/>
						</div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Stream <span className="text-meta-1">*</span>
							</label>
							<select
								value={streamId}
								onChange={(e) => setStreamId(Number(e.target.value))}
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							>
								<option value="" disabled>
									Select stream
								</option>
								{streams.map((stream) => (
									<option key={stream.id} value={stream.id}>
										{stream.name}
									</option>
								))}
							</select>
						</div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Medium <span className="text-meta-1">*</span>
							</label>
							<select
								value={medium}
								onChange={(e) => setMedium(e.target.value)}
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							>
								<option value="" disabled>
									Select Medium
								</option>
								<option key="tamil" value="tamil">
									Tamil
								</option>
								<option key="english" value="english">
									English
								</option>
							</select>
						</div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Rank District <span className="text-meta-1">*</span>
							</label>
							<select
								value={rankDistrictId}
								onChange={(e) => setRankDistrictId(Number(e.target.value))}
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							>
								<option value="" disabled>
									Select Rank District
								</option>
								{centersDistricts.map((district) => (
									<option key={district.id} value={district.id}>
										{district.name}
									</option>
								))}
							</select>
						</div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Exam District <span className="text-meta-1">*</span>
							</label>
							<select
								value={examDistrictId}
								onChange={(e) => setExamDistrictId(Number(e.target.value))}
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							>
								<option value="" disabled>
									Select Exam District
								</option>
								{centersDistricts.map((district) => (
									<option key={district.id} value={district.id}>
										{district.name}
									</option>
								))}
							</select>
						</div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Center <span className="text-meta-1">*</span>
							</label>
							<select
								value={centreId}
								onChange={(e) => {
									setCentreId(Number(e.target.value));
									console.log("ID: ", e.target.value);
								}}
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							>
								<option value="" disabled>
									Select Exam Center
								</option>
								{currCenters.map((center) => (
									<option key={center.id} value={center.id}>
										{center.name}
									</option>
								))}
							</select>
						</div>
					</div>
					<div>
						<div className="mb-4.5">
							<div className="mb-4.5">
								<label className="mb-2.5 block text-black dark:text-white">
									NIC <span className="text-meta-1">*</span>
								</label>
								<input
									type="text"
									value={nic}
									onChange={(e) => setNic(e.target.value)}
									placeholder="Enter NIC"
									inputMode="numeric"
									className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
								/>
							</div>
							<div className="mb-4.5">
								<label className="mb-2.5 block text-black dark:text-white">
									Gender <span className="text-meta-1">*</span>
								</label>
								<select
									value={gender}
									onChange={(e) => setGender(e.target.value)}
									className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
								>
									<option value="" disabled>
										Select Gender
									</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</div>
							<label className="mb-2.5 block text-black dark:text-white">
								School
							</label>
							<input
								type="text"
								value={school}
								onChange={(e) => setSchool(e.target.value)}
								placeholder="Enter Student's School"
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							/>
						</div>

						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Address
							</label>
							<input
								type="text"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder="Enter Address"
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							/>
						</div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter Email Address"
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							/>
						</div>
						<div className="mb-4.5">
							<label className="mb-2.5 block text-black dark:text-white">
								Phone
							</label>
							<input
								type="text"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="Enter Contact Number"
								inputMode="numeric"
								className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-input/30 dark:text-white dark:focus:border-primary"
							/>
						</div>
					</div>
				</div>
				<div className="w-full px-3 pt-4">
					<Button variant={"outline"} onClick={handleSubmit} className="centre">
						Add Student
					</Button>
				</div>
			</div>

			{/* <Snackbar config={snackBarConfig} /> */}
		</>
	);
};

export default AddStudent;
