import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Districts from './pages/Districts';
import ExamCentres from './pages/ExamCentres';
import Coordinators from './pages/Coordinators';

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
      </Routes>
    </>
  );
}

export default App;
