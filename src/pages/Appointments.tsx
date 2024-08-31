import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { Appointment} from '../types/types';
import { getAppointments } from '../services/appointmentService';
import AppointmentsTable from '../components/Tables/AppointmentsTable';

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchAppointments = async () => {
          try {
              const appointments = await getAppointments();
              setAppointments(appointments);
          } catch (error) {
              setError('Failed to fetch appointments');
          } finally {
              setLoading(false);
          }
      };

      fetchAppointments();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Appointments" />
      <div className="flex flex-col gap-10">
        {loading ? <div>Loading...</div> : <AppointmentsTable appointmentData={appointments} />}
      </div>
    </DefaultLayout>
  );
};

export default Appointments;
