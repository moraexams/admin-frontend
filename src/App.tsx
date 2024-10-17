import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Districts from './pages/District/Districts';
import ExamCentres from './pages/District/ExamCentres';
import Coordinators from './pages/District/Coordinators';
import ExamPaperDistributionTableView from './pages/Distribution/DistributionTableView';
import ExamPaperDistributionCardView from './pages/Distribution/DistributionCardView';
import Students from './pages/Student/Students';
import Marks from './pages/Marks/Marks';
import StudentsCentreWise from './pages/Student/StudentsCentreWise';
import AddStudent from './pages/Student/AddStudent';
import UnVerifiedStudents from './pages/Student/UnVerifiedStudents';
import VerifyStudent from './pages/Student/VerifyStudent';
import EnterMarks from './pages/Marks/EnterMarks';
import VerifyMarks from './pages/Marks/VerifyMarks';
import StudentMarksCentreWise from './pages/Marks/StudentMarksCentreWise';
import EnteredStudentMarks from './pages/Stats/EnteredStudentMarks';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

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
              <PageTitle title="Signin | MoraExams" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | MoraExams" />
              <SignUp />
            </>
          }
        />
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | MoraExams" />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <PageTitle title="Users | MoraExams" />
              <Users />
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
              <PageTitle title="Exam Centres | MoraExams" />
              <ExamCentres />
            </>
          }
        />
        <Route
          path="/district/coordinators"
          element={
            <>
              <PageTitle title="Coordinators | MoraExams" />
              <Coordinators />
            </>
          }
        />
        <Route
          path="/distribution/table"
          element={
            <>
              <PageTitle title="Exam Paper Distribution Table| MoraExams" />
              <ExamPaperDistributionTableView />
            </>
          }
        />
        <Route
          path="/distribution/card"
          element={
            <>
              <PageTitle title="Exam Paper Distribution Card | MoraExams" />
              <ExamPaperDistributionCardView />
            </>
          }
        />
        <Route
          path="/students/all"
          element={
            <>
              <PageTitle title="Students | MoraExams" />
              <Students />
            </>
          }
        />
        <Route
          path="/students/add"
          element={
            <>
              <PageTitle title="Add Student | MoraExams" />
              <AddStudent />
            </>
          }
        />
        <Route
          path="/students/centre"
          element={
            <>
              <PageTitle title="Students | MoraExams" />
              <StudentsCentreWise />
            </>
          }
        />
        <Route
          path="/students/verify"
          element={
            <>
              <PageTitle title="Students | MoraExams" />
              <VerifyStudent />
            </>
          }
        />
        <Route
          path="/students/unverified"
          element={
            <>
              <PageTitle title="Students | MoraExams" />
              <UnVerifiedStudents />
            </>
          }
        />
        <Route
          path="/marks"
          element={
            <>
              <PageTitle title="Marks | MoraExams" />
              <Marks />
            </>
          }
        />
        <Route
          path="/marks/enter"
          element={
            <>
              <PageTitle title="Enter Marks | MoraExams" />
              <EnterMarks />
            </>
          }
        />
        <Route
          path="/marks/verify"
          element={
            <>
              <PageTitle title="Verify Marks | MoraExams" />
              <VerifyMarks />
            </>
          }
        />
        <Route
          path="/studentmarks"
          element={
            <>
              <PageTitle title="Student Marks | MoraExams" />
              <StudentMarksCentreWise />
            </>
          }
        />
        <Route
          path="/stats/enteredmarks"
          element={
            <>
              <PageTitle title="Entered Marks | MoraExams" />
              <EnteredStudentMarks />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
