import axiosInstance from "@/axiosConfig";

export function finalizeResults() {
	return axiosInstance.get("/result/finalize");
}
