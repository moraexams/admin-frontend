import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";


export const generateAttendanceSheetPDFs = async () => {
    try {
        const response = await axiosInstance.get("/attendance-sheet/generate");
        return response.data
    } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
            if (error.response?.data) {
                throw new Error(error.response?.data.message);
            }
        }
        throw "An error occurred while generating attendance sheets";
    }
}


export const downloadAttendanceSheets = async () => {
    try {
        const response = await axiosInstance.get("/attendance-sheet/download");
        return response.data
    } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
            if (error.response?.data) {
                throw new Error(error.response?.data.message);
            }
        }
        throw "An error occurred while downloading attendance sheet zip file";
    }
}