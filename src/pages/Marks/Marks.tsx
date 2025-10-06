import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CopyCheck, Pen } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { MarksBoundariesView } from "../../components/MarksBoundariesView";

const PERMISSION__MARKS_BOUNDARY_VIEW = ["PRESIDENT", "TECH_COORDINATOR"];
const SUBJECTS = [
	{
		id: 4,
		name: "Combined Maths",
	},
	{
		id: 3,
		name: "Bio",
	},
	{
		id: 1,
		name: "Physics",
	},
	{
		id: 2,
		name: "Chemistry",
	},
	{
		id: 5,
		name: "ICT",
	},
];
const PARTS = new Array(2).fill("0");

const Marks = () => {
	const role = localStorage.getItem("role");

	return (
		<>
			<Breadcrumb pageName="Marks" />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Subject</TableHead>
						<TableHead className="text-center">Part 1</TableHead>
						<TableHead className="text-center">Part 2</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{SUBJECTS.map((subject) => {
						return (
							<TableRow key={subject.id}>
								<TableCell className="font-medium">{subject.name}</TableCell>

								{PARTS.map((_, index) => {
									return (
										<TableCell key={index.toString()}>
											<div className="flex items-center justify-center space-x-3.5">
												<Link
													to={`/marks/enter?subject=${subject.id}&part=p${index + 1}`}
												>
													<Button variant="secondary">
														<Pen />
														<span className="font-semibold">Enter</span>
													</Button>
												</Link>
												<Link
													to={`/marks/verify?subject=${subject.id}&part=p${index + 1}`}
												>
													<Button variant="secondary">
														<CopyCheck />
														<span className="font-semibold">Verify</span>
													</Button>
												</Link>
											</div>
										</TableCell>
									);
								})}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{typeof role === "string" &&
			PERMISSION__MARKS_BOUNDARY_VIEW.includes(role) ? (
				<MarksBoundariesView />
			) : null}
		</>
	);
};

export default Marks;
