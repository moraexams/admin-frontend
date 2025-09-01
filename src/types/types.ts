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
	counts: Count[];
	bus_route: string;
	bus_departure_time: string;
	bus_arrival_time: string;
	travel_duration: string;
	substitude_times: string;
}

export interface Count {
	subject: string;
	code: string;
	medium: string;
	count: number;
}

export interface Coordinator {
	id?: number;
	name: string;
	district_id: number;
	associated_user_id?: number;
	telephone_no: string;
}

export interface Student {
	index_no?: number;
	name: string;
	stream_id: number;
	stream?: Stream;
	medium: string;
	rank_district_id: number;
	rank_district?: District;
	exam_district_id: number;
	exam_district?: District;
	exam_centre_id: number;
	exam_centre?: ExamCentre;
	nic: string;
	gender: string;
	email: string;
	telephone_no: string;
	school: string;
	address: string;
	//not sure about these attributes
	registered_by_id: number;
	registered_by?: User;
	reg_date: string;
	checked_by_id: number;
	checked_at: string;
	created_at: string;
}

export interface StudentMark {
	index_no: number;
	name: string;
	stream: string;
	s1_p1: number;
	s1_p2: number;
	s2_p1: number;
	s2_p2: number;
	s3_p1: number;
	s3_p2: number;
}

export interface Stream {
	id: number;
	name: string;
	subject1_code: string;
	subject2_code: string;
	subject3_code: string;
}
export interface Mark {
	index_no: number; // Primary key and unique
	s1_p1?: number;
	s1_p1_ent_by_id?: number;
	s1_p1_ent_by?: User;
	s1_p1_ent_at?: string;
	s1_p1_vfd_by_id?: number;
	s1_p1_vfd_by?: User;
	s1_p1_vfd_at?: string;
	s1_p2?: number;
	s1_p2_ent_by_id?: number;
	s1_p2_ent_by?: User;
	s1_p2_ent_at?: string;
	s1_p2_vfd_by_id?: number;
	s1_p2_vfd_by?: User;
	s1_p2_vfd_at?: string;
	s2_p1?: number;
	s2_p1_ent_by_id?: number;
	s2_p1_ent_by?: User;
	s2_p1_ent_at?: string;
	s2_p1_vfd_by_id?: number;
	s2_p1_vfd_by?: User;
	s2_p1_vfd_at?: string;
	s2_p2?: number;
	s2_p2_ent_by_id?: number;
	s2_p2_ent_by?: User;
	s2_p2_ent_at?: string;
	s2_p2_vfd_by_id?: number;
	s2_p2_vfd_by?: User;
	s2_p2_vfd_at?: string;
	s3_p1?: number;
	s3_p1_ent_by_id?: number;
	s3_p1_ent_by?: User;
	s3_p1_ent_at?: string;
	s3_p1_vfd_by_id?: number;
	s3_p1_vfd_by?: User;
	s3_p1_vfd_at?: string;
	s3_p2?: number;
	s3_p2_ent_by_id?: number;
	s3_p2_ent_by?: User;
	s3_p2_ent_at?: string;
	s3_p2_vfd_by_id?: number;
	s3_p2_vfd_by?: User;
	s3_p2_vfd_at?: string;
}

export interface MarksBoundaries {
	subjectId: string;
	subjectName: string;
	forA: number;
	forB: number;
	forC: number;
	forS: number;
}

export interface LocalStorage_User {
	id: number;
	created_at: string;
	updated_at: string;
	deleted_at: null;
	name: string;
	role: string;
	username: string;
	approved: boolean;
}
