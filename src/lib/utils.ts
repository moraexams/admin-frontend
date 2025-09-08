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

export function humanReadableTimeRemaining(seconds: number): string {
	if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
	return `${Math.floor(seconds / 3600)} hours and ${Math.floor((seconds % 3600) / 60)} minutes`;
}
