import { ROLE_COORDINATOR } from "@/common/roles";
import CentreWiseStats from "@/components/centre-wise-stats";
import StreamWiseStats from "@/components/stream-wise-stats";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LOCAL_STORAGE__ROLE } from "@/services/authServices";
import { CircleAlert } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardDataStats from "../components/CardDataStats";
import { type StatCounts, getStatCounts } from "../services/statsServices";

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const [counts, setCounts] = useState<StatCounts | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const role = localStorage.getItem(LOCAL_STORAGE__ROLE);
		if (role === ROLE_COORDINATOR) {
			navigate("/admissions");
		}

		const fetchStats = async () => {
			try {
				const counts = await getStatCounts();
				setCounts(counts);
			} catch (error) {
				setError("Failed to fetch counts");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					<Alert variant="default" className="mb-4">
						<CircleAlert />
						<AlertTitle>CAUTION</AlertTitle>
						<AlertDescription>
							<p className="max-w-prose">
								This is not a finished product. There will be <b>issues</b>, and{" "}
								<b>missing features</b>. Please report any issues you find, and{" "}
								<b>
									<i>BE PATIENT!</i>
								</b>
							</p>
						</AlertDescription>
					</Alert>
					{counts === null ? (
						<span>Loading...</span>
					) : (
						<div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-5 2xl:gap-5">
							<CardDataStats
								title="Student Registrations"
								total={counts.total_student_registrations}
								link="/students/registrations"
							/>
							<CardDataStats
								title="Pending Registrations"
								description="Students whose payment is not received yet"
								total={counts.pending_student_registrations || 0}
							/>
							<CardDataStats
								title="Verified Students"
								description="Students whose payment is verified"
								total={counts.verified_students || 0}
							/>
							<CardDataStats title="Total Centers" total={counts.exam_center} />
							<CardDataStats
								title="Total Coordinators"
								total={counts.coordinator}
							/>
						</div>
					)}

					<StreamWiseStats />
					<CentreWiseStats />
				</>
			)}
		</>
	);
};

export default Dashboard;
