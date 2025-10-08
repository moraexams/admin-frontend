import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
	year: "numeric",
	month: "short",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
});

export const SUBJECTS = {
	"1": "Physics",
	"2": "Chemistry",
	"3": "Bio",
	"4": "Combined Maths",
	"5": "ICT",
};
export function isValidSubjectId(
	subjectId: string | null,
): subjectId is keyof typeof SUBJECTS {
	return subjectId !== null && Object.keys(SUBJECTS).includes(subjectId);
}

export const PARTS = ["p1", "p2"];
