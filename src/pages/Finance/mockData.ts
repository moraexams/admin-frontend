import type {
	Bill,
	District,
	Template,
	Transaction,
} from "../../types/finance";

// Mock Districts
export const districts: District[] = [
	{
		id: "1",
		name: "Colombo",
		budget: 50000,
		spent: 24500,
		income: 12000,
	},
	{
		id: "2",
		name: "Jaffna",
		budget: 45000,
		spent: 32000,
		income: 15000,
	},
	{
		id: "3",
		name: "Trincomalee",
		budget: 40000,
		spent: 18000,
		income: 9000,
	},
	{
		id: "4",
		name: "Vavuniya",
		budget: 38000,
		spent: 21000,
		income: 11000,
	},
];

// Mock Transactions
export const transactions: Transaction[] = [
	{
		id: "1",
		date: "2025-04-20",
		type: "income",
		amount: 5000,
		category: "Registration",
		description: "Physical registration fees",
		districtId: "1",
		billId: "1",
	},
	{
		id: "2",
		date: "2025-04-20",
		type: "expense",
		amount: 120000,
		category: "Paper Printing",
		description: "Printing of exam papers",
		districtId: "2",
		billId: "2",
	},
	{
		id: "3",
		date: "2025-04-21",
		type: "income",
		amount: 100000,
		category: "Sponsorship",
		description: "Gold sponsor",
		districtId: "2",
		billId: "3",
	},
	{
		id: "4",
		date: "2025-04-21",
		type: "expense",
		amount: 800,
		category: "Marketing",
		description: "Social media ads",
		districtId: "3",
		billId: "4",
	},
	{
		id: "5",
		date: "2025-04-18",
		type: "expense",
		amount: 25000,
		category: "Venue",
		description: "Venue booking for exam",
		districtId: "3",
		billId: "5",
	},
];

// Mock Bills
export const bills: Bill[] = [
	{
		id: "1",
		date: "2025-04-02",
		amount: 500,
		vendor: "Transport",
		description: "Auto transport",
		transactionId: "1",
	},
	{
		id: "2",
		date: "2025-04-01",
		amount: 1200,
		vendor: "Transport",
		description: "Paper Transport",
		transactionId: "2",
	},
	{
		id: "3",
		date: "2025-03-30",
		amount: 7000,
		vendor: "CompanyName",
		description: "Event sponsorship",
		transactionId: "3",
	},
];

// Mock Templates
export const templates: Template[] = [
	{
		id: "1",
		name: "Transport",
		type: "expense",
		amount: 2500,
		category: "Transport",
		description: "Auto transport",
		districtId: "1",
	},
	{
		id: "2",
		name: "Paper Printing",
		type: "expense",
		amount: 12000,
		category: "Paper Printing",
		description: "Printing of exam papers",
		districtId: "2",
	},
];

export const getTotalExpenses = (): number => {
	return transactions
		.filter((transaction) => transaction.type === "expense")
		.reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const getRecentTransactions = (limit = 5): Transaction[] => {
	return [...transactions]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, limit);
};

export const getDistrictNameById = (districtId: string): string => {
	const district = districts.find((d) => d.id === districtId);
	return district ? district.name : "Unknown District";
};

export const getTotalDistrictExpenses = (): number => {
	return districts.reduce((sum, district) => sum + district.spent, 0);
};
