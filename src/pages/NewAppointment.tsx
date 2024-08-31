import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import AppointmentForm from '../components/Forms/AppointmentForm';
import DefaultLayout from '../layout/DefaultLayout';

const NewAppointment = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="New Appointment" />

        <AppointmentForm/>
      </div>
    </DefaultLayout>
  );
};

export default NewAppointment;
