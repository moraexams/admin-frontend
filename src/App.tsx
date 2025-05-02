import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import DangerZone from "./pages/DangerZone";
import Dashboard from "./pages/Dashboard";
import ExamPaperDistributionCardView from "./pages/Distribution/DistributionCardView";
import ExamPaperDistributionTableView from "./pages/Distribution/DistributionTableView";
import Coordinators from "./pages/District/Coordinators";
import Districts from "./pages/District/Districts";
import ExamCentres from "./pages/District/ExamCentres";
import DashboardFinance from "./pages/Finance/DashboardFinance";
import AddFinanceRecord from "./pages/Finance/AddFinanceRecord";
import EnterMarks from "./pages/Marks/EnterMarks";
import Marks from "./pages/Marks/Marks";
import StudentMarksCentreWise from "./pages/Marks/StudentMarksCentreWise";
import VerifyMarks from "./pages/Marks/VerifyMarks";
import EnteredStudentMarks from "./pages/Stats/EnteredStudentMarks";
import AddStudent from "./pages/Student/AddStudent";
import Students from "./pages/Student/Students";
import StudentsCentreWise from "./pages/Student/StudentsCentreWise";
import UnVerifiedStudents from "./pages/Student/UnVerifiedStudents";
import VerifyStudent from "./pages/Student/VerifyStudent";
import Users from "./pages/Users";

function App() {
	const [loading, setLoading] = useState<boolean>(true);
	const { pathname } = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: it has to be
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000);
	}, []);

	return loading ? (
		<Loader />
	) : (
		<>
			<Routes>
				<Route
					path="/auth/signin"
					element={
						<>
							<PageTitle title="Signin | Mora Exams" />
							<SignIn />
						</>
					}
				/>
				<Route
					path="/auth/signup"
					element={
						<>
							<PageTitle title="Signup | Mora Exams" />
							<SignUp />
						</>
					}
				/>
				<Route
					index
					element={
						<>
							<PageTitle title="Dashboard | Mora Exams" />
							<Dashboard />
						</>
					}
				/>
				<Route
					path="/users"
					element={
						<>
							<PageTitle title="Users | Mora Exams" />
							<Users />
						</>
					}
				/>
				<Route
					path="/danger-zone"
					element={
						<>
							<PageTitle title="Danger Zone | Mora Exams" />
							<DangerZone />
						</>
					}
				/>
				<Route
					path="/districts"
					element={
						<>
							<PageTitle title="Districts | MoraExams" />
							<Districts />
						</>
					}
				/>
				<Route
					path="/district/centres"
					element={
						<>
							<PageTitle title="Exam Centres | Mora Exams" />
							<ExamCentres />
						</>
					}
				/>
				<Route
					path="/district/coordinators"
					element={
						<>
							<PageTitle title="Coordinators | Mora Exams" />
							<Coordinators />
						</>
					}
				/>
				<Route
					path="/distribution/table"
					element={
						<>
							<PageTitle title="Exam Paper Distribution Table| Mora Exams" />
							<ExamPaperDistributionTableView />
						</>
					}
				/>
				<Route
					path="/distribution/card"
					element={
						<>
							<PageTitle title="Exam Paper Distribution Card | Mora Exams" />
							<ExamPaperDistributionCardView />
						</>
					}
				/>
				<Route
					path="/students/all"
					element={
						<>
							<PageTitle title="Students | Mora Exams" />
							<Students />
						</>
					}
				/>
				<Route
					path="/students/add"
					element={
						<>
							<PageTitle title="Add Student | Mora Exams" />
							<AddStudent />
						</>
					}
				/>
				<Route
					path="/students/centre"
					element={
						<>
							<PageTitle title="Students | Mora Exams" />
							<StudentsCentreWise />
						</>
					}
				/>
				<Route
					path="/students/verify"
					element={
						<>
							<PageTitle title="Students | Mora Exams" />
							<VerifyStudent />
						</>
					}
				/>
				<Route
					path="/students/unverified"
					element={
						<>
							<PageTitle title="Students | Mora Exams" />
							<UnVerifiedStudents />
						</>
					}
				/>
				<Route
					path="/marks"
					element={
						<>
							<PageTitle title="Marks | Mora Exams" />
							<Marks />
						</>
					}
				/>
				<Route
					path="/marks/enter"
					element={
						<>
							<PageTitle title="Enter Marks | Mora Exams" />
							<EnterMarks />
						</>
					}
				/>
				<Route
					path="/marks/verify"
					element={
						<>
							<PageTitle title="Verify Marks | Mora Exams" />
							<VerifyMarks />
						</>
					}
				/>
				<Route
					path="/studentmarks"
					element={
						<>
							<PageTitle title="Student Marks | Mora Exams" />
							<StudentMarksCentreWise />
						</>
					}
				/>
				<Route
					path="/stats/enteredmarks"
					element={
						<>
							<PageTitle title="Entered Marks | Mora Exams" />
							<EnteredStudentMarks />
						</>
					}
				/>
				<Route
					path="/finance/dashboard"
					element={
						<>
							<PageTitle title="Finance Dashboard | MoraExams" />
							<DashboardFinance />
						</>
					}
				/>
				<Route
					path="/finance/add_finance"
					element={
						<>
							<PageTitle title="Finance_Add_Record | MoraExams" />
							<AddFinanceRecord />
						</>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
