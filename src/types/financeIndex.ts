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
