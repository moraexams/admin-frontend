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

export interface District {
  id?: number;
  name: string;
  coordinators?: Coordinator[];
  exam_centres?: ExamCentre[];
  created_at: string;
}

export interface ExamCentre {
  id?: number;
  name: string;
  district_id: number;
  place: string;
  gender: string;
  //
  paper_counts : PaperCount[];
  bus_route: string;
}

export interface PaperCount {
  id?: number;
  subject: string;
  medium: string;
  count: number;
}

export interface Coordinator {
  id?: number;
  name: string;
  district_id: number;
  telephone_no: string;
}
