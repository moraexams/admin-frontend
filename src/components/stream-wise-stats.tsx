import {
	type StreamWiseStats,
	getStatsStreamWise,
} from "@/services/statsServices";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StreamWiseStats() {
	const [streamStats, setStreamStats] = useState<StreamWiseStats>({
		counts: [],
		total_english: 0,
		total_tamil: 0,
	});

	useEffect(() => {
		getStatsStreamWise()
			.then((stats) => {
				setStreamStats(stats);
			})
			.catch((error) => {
				console.error("Error fetching stream wise stats:", error);
				toast.error("Failed to fetch stream wise stats.");
			});
	}, []);
	
	return (
		<section className="mt-8 mb-5">
				<h2 className="text-xl font-semibold mb-2">
				Total Stream Wise Stats
			</h2>

				<table className="w-full table-auto">
					<thead>
						<tr className="font-bold text-left">
							<th className="py-4">
								Stream
							</th>
							<th className="py-4">Tamil</th>
							<th className="py-4">English</th>
							<th className="py-4">Total</th>
						</tr>
					</thead>
					<tbody>
						<>
							{streamStats.counts?.map((count: any, key: number) => (
								<tr key={key}>
									<td className="py-5">
										<h5 className="font-medium">
											{count.stream_name}
										</h5>
									</td>
									<td className="py-5">
										<p>
											{count.tamil_count}
										</p>
									</td>
									<td className="py-5">
										<p>
											{count.english_count}
										</p>
									</td>
									<td className="py-5">
										<p className="font-semibold">
											{count.total_count}
										</p>
									</td>
								</tr>
							))}
							<tr className="font-semibold">
								<td className="py-5">
									<h5>
										<strong>Total</strong>
									</h5>
								</td>
								<td className="py-5">
									<p>
										{streamStats.total_tamil}
									</p>
								</td>
								<td className="py-5">
									<p>
										{streamStats.total_english}
									</p>
								</td>
								<td className="py-5">
									<p className="font-bold text-primary">
										<strong>
											{streamStats.total_tamil + streamStats.total_english}
										</strong>
									</p>
								</td>
							</tr>
						</>
					</tbody>
				</table>
		</section>

	);
}
