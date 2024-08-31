import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import NewAppointment from './pages/NewAppointment';
import Users from './pages/Users';

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
          path="/appointments"
          element={
            <>
              <PageTitle title="Appointments | MoraExams" />
              <Appointments />
            </>
          }
        />
        <Route
          path="/appointments/new"
          element={
            <>
              <PageTitle title="New Appointment | MoraExams" />
              <NewAppointment />
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
      </Routes>
    </>
  );
}

export default App;
