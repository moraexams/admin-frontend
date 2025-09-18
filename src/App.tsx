import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Loader from "./components/Loader";
import PageTitle from "./components/PageTitle";

import DefaultLayout from "./layout/DefaultLayout";
import AuditLogs from "./pages/AuditLogs";
import PasswordReset from "./pages/Authentication/PasswordReset";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import DangerZone from "./pages/DangerZone";
import Dashboard from "./pages/Dashboard";
import ExamPaperDistributionCardView from "./pages/Distribution/DistributionCardView";
import ExamPaperDistributionTableView from "./pages/Distribution/DistributionTableView";
import Coordinators from "./pages/District/Coordinators";
import Districts from "./pages/District/Districts";
import ExamCentres from "./pages/District/ExamCentres";
import DistrictsOverview from "./pages/DistrictsOverview";
import AddBill from "./pages/Finance/AddBill";
import AddFinanceRecord from "./pages/Finance/AddFinanceRecord";
import AllTransactions from "./pages/Finance/AllTransactions";
import BillGallery from "./pages/Finance/BillGallery";
import CoordinatorPayments from "./pages/Finance/CoordinatorPayments";
import FinanceDashboard from "./pages/Finance/Dashboard";
import DistrictsSummary from "./pages/Finance/DistrictsSummary";
import TransactionCategories from "./pages/Finance/TransactionCategories";
import ManualAdmissions from "./pages/ManualAdmissions";
import EnterMarks from "./pages/Marks/EnterMarks";
import Marks from "./pages/Marks/Marks";
import StudentMarksCentreWise from "./pages/Marks/StudentMarksCentreWise";
import VerifyMarks from "./pages/Marks/VerifyMarks";
import EnteredStudentMarks from "./pages/Stats/EnteredStudentMarks";
import StudentRegistrationsCountCentreWise from "./pages/Stats/StudentRegistrationsCentreWise";
import StudentRegistrationsCountDistrictWise from "./pages/Stats/StudentRegistrationsDistrictWise";
import AddStudent from "./pages/Student/AddStudent";
import UnverifiedStudents from "./pages/Student/Registrations";
import RejectedStudents from "./pages/Student/RejectedStudents";
import StudentsCentreWise from "./pages/Student/StudentsCentreWise";
import VerifiedStudents from "./pages/Student/VerifiedStudents";
import StudentsAddedByCoordinator from "./pages/StudentsAddedByCoordinator";
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
		document.documentElement.classList.toggle(
			"dark",
			window.matchMedia("(prefers-color-scheme: dark)").matches,
		);
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", (e) => {
				document.documentElement.classList.toggle("dark", e.matches);
			});
	}, []);

	return loading ? (
		<Loader />
	) : (
		<>
			<Routes>
				<Route
					path="/reset-password"
					element={
						<>
							<PageTitle title="Reset Password | Mora Exams" />
							<PasswordReset />
						</>
					}
				/>
				<Route
					path="/sign-in"
					element={
						<>
							<PageTitle title="Sign In | Mora Exams" />
							<SignIn />
						</>
					}
				/>
				<Route
					path="/sign-up"
					element={
						<>
							<PageTitle title="Sign Up | Mora Exams" />
							<SignUp />
						</>
					}
				/>
				<Route element={<DefaultLayout />}>
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
					<Route path="/districts/overview" element={<DistrictsOverview />} />
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
						path="/students/registrations"
						element={
							<>
								<UnverifiedStudents />
							</>
						}
					/>
					<Route
						path="/students/verified"
						element={
							<>
								<VerifiedStudents />
							</>
						}
					/>
					<Route
						path="/students/rejected"
						element={
							<>
								<RejectedStudents />
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
						path="/stats/student-registrations/district-wise"
						element={
							<>
								<StudentRegistrationsCountDistrictWise />
							</>
						}
					/>
					<Route
						path="/stats/student-registrations/centre-wise"
						element={
							<>
								<StudentRegistrationsCountCentreWise />
							</>
						}
					/>
					<Route
						path="/finance/dashboard"
						element={
							<>
								<PageTitle title="Finance Dashboard | MoraExams" />
								<FinanceDashboard />
							</>
						}
					/>
					<Route
						path="/finance/districts"
						element={
							<>
								<PageTitle title="Districts Summary | MoraExams" />
								<DistrictsSummary />
							</>
						}
					/>
					<Route
						path="/finance/billgallery"
						element={
							<>
								<PageTitle title="Bills | MoraExams" />
								<BillGallery />
							</>
						}
					/>
					<Route
						path="/finance/add-transaction"
						element={
							<>
								<PageTitle title="Add Transaction | Mora Exams" />
								<AddFinanceRecord />
							</>
						}
					/>
					<Route
						path="/finance/transactions"
						element={
							<>
								<PageTitle title="Transactions | Mora Exams" />
								<AllTransactions />
							</>
						}
					/>
					<Route
						path="/finance/add-bill/:transaction-id"
						element={
							<>
								<PageTitle title="Add Bill | Mora Exams" />
								<AddBill />
							</>
						}
					/>
					<Route
						path="/finance/transaction-categories"
						element={
							<>
								<PageTitle title="Transaction Categories | Mora Exams" />
								<TransactionCategories />
							</>
						}
					/>
					<Route
						path="/finance/coordinator-payments"
						element={
							<>
								<PageTitle title="Coordinator Payments | Mora Exams" />
								<CoordinatorPayments />
							</>
						}
					/>
					<Route
						path="/audit-logs"
						element={
							<>
								<PageTitle title="Audit Logs | Mora Exams" />
								<AuditLogs />
							</>
						}
					/>
				</Route>
				<Route
					path="/admissions"
					element={
						<>
							<PageTitle title="Admissions | Mora Exams" />
							<ManualAdmissions />
						</>
					}
				/>
				<Route
					path="/coordinator/registered-students"
					element={
						<>
							<PageTitle title="Registered Students | Mora Exams" />
							<StudentsAddedByCoordinator />
						</>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
