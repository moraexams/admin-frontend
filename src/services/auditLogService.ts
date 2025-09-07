import axiosInstance from "../axiosConfig";

export interface AuditLogItem {
	id: string;
	timestamp: string;
	action: string;
	entity_type: string;
	entity_id: string;
	performed_by: string;
}

export function getAuditLogs(page: number, itemsPerPage: number) {
	return axiosInstance.get<{ logs: Array<AuditLogItem>; count: number }>(
		`/logs?page=${page}&pageSize=${itemsPerPage}`,
	);
}
