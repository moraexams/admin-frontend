import { z } from "zod";

export interface Transaction {
	id: string;
	date: string;
	type: "income" | "expense";
	amount: number;
	category: string;
	description: string;
	districtId: string;
	billId?: string;
	templateId?: string;
}

export interface District {
	id: string;
	name: string;
	budget: number;
	spent: number;
	income: number;
}

export interface Bill {
	id: string;
	date: string;
	amount: number;
	vendor: string;
	description: string;
	attachmentUrl?: string;
	transactionId: string;
}

export interface Template {
	id: string;
	name: string;
	type: "income" | "expense";
	amount: number;
	category: string;
	description: string;
	districtId: string;
}

export interface ChartData {
	name: string;
	income: number;
	expenses: number;
}

export const financeSchema = z.object({
	transactionType: z.enum(["income", "expense"]),
	category: z.string().nonempty("Please select a type"),
	description: z.string().optional(),
	amount: z.coerce.number().min(1, "Amount must be greater than 0"),
	createdAt: z.string().nonempty("Date & Time is required"),
	paymentAccount: z.enum(["bank", "cash"]),
});

export type FinanceFormData = z.infer<typeof financeSchema>;
