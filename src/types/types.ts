export interface Patient {
  id?: number;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  date_of_birth: string;
}

export interface Doctor {
  id?: number;
  name: string;
  specialty: string;
  contact_number: string;
  email: string;
  availability?: string[];
}

export interface Appointment {
  id?: number;
  patient: Patient;
  doctor: Doctor;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export interface User {
  id?: number;
  name: string;
  username: string;
  role: string;
  created_at: string;
  approved: boolean;
}
