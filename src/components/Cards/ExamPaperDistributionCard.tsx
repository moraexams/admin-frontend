import { sortByKey } from '../../services/filter';
import { Coordinator, Count, District, ExamCentre } from '../../types/types';

const CoordinatorCard = ({ coordinator }: { coordinator: Coordinator }) => {
    return (
        <div className="min-w-40 rounded-sm border border-stroke bg-white dark:bg-boxdark p-4 shadow-default transition duration-300 ease-in-out">
            <h3 className="text-lg font-bold text-black dark:text-white">{coordinator.name}</h3>
            <p className="text-gray-700 dark:text-white">
                <strong>{coordinator.telephone_no}</strong>
            </p>
        </div>
    );
};

const CentreCard = ({ centre }: { centre: ExamCentre }) => {
    return (
        <div className="border border-slate-300 rounded-lg bg-white px-8 py-6 mt-6 dark:bg-boxdark md:px-17.5 md:py-8">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{centre.name}</h3>
            <div className="text-black dark:text-white py-2">
                <table className="table-fixed border-separate border-spacing-1 text-black dark:text-white">
                    <tbody>
                        <tr>
                            <td>Bus Route</td>
                            <td>:</td>
                            <td><strong>{centre.bus_route}</strong></td>
                        </tr>
                        <tr>
                            <td>Departure Time</td>
                            <td>:</td>
                            <td><strong>{centre.bus_departure_time}</strong></td>
                        </tr>
                        <tr>
                            <td>Arrival Time</td>
                            <td>:</td>
                            <td><strong>{centre.bus_arrival_time}</strong></td>
                        </tr>
                        <tr>
                            <td>Travel Duration</td>
                            <td>:</td>
                            <td><strong>{centre.travel_duration}</strong></td>
                        </tr>
                        <tr>
                            <td>Substitude Times</td>
                            <td>:</td>
                            <td><strong>{centre.substitude_times}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-2">
                {centre.counts && centre.counts.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 mt-2 dark:bg-slate-800 text-black dark:text-white">
                        <thead className="bg-gray">
                            <tr>
                                <th className="px-4 py-2 text-left text-md font-medium text-black">Subject</th>
                                <th className="px-4 py-2 text-left text-md font-medium text-black">Medium</th>
                                <th className="px-4 py-2 text-left text-md font-medium text-black">Count</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-400">
                            {sortByKey(centre.counts, "subject").map((paper: Count, i: number) => (
                                <tr key={i} className='dark:bg-slate-700'>
                                    <td className="px-4 py-2 ">{paper.subject}</td>
                                    <td className="px-4 py-2 ">{paper.medium}</td>
                                    <td className="px-4 py-2 font-semibold ">{paper.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No paper counts available.</p>
                )}
            </div>
        </div>
    );
};

// Main component to display exam centers and coordinators based on selected district
const ExamPaperDistributionCard = ({ districtData, district, centre }: { districtData: District[], district: Number, centre: Number }) => {
    // Find the selected district from the districtData
    const selectedDistrict = districtData.find(d => d.id === district);

    // Get the exam centres for the selected district
    const filteredCentres = selectedDistrict?.exam_centres || [];
    const coordinators = selectedDistrict?.coordinators || [];
    return (
        <div className="flex-wrap justify-center">
            {/* Display coordinators */}
            {coordinators.length > 0 ? (
                <div className="w-full mt-2">
                    <h2 className="text-2xl font-bold text-black text-center mb-2 dark:text-white">Coordinators</h2>
                    <div className="flex flex-wrap justify-center">
                        {coordinators.map(coordinator => (
                            <CoordinatorCard key={coordinator.id} coordinator={coordinator} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center w-full mt-6">
                    <p>No coordinators found for this district.</p>
                </div>
            )}

            {/* Heading for Exam Centres */}
            <div>
                <h2 className="text-2xl font-bold text-black text-center mt-6 mb-2 dark:text-white">Exam Centres</h2>
            </div>
            <div>
                {/* Display exam centres */}
                {district && centre === -1 && filteredCentres.length > 0 ? (
                    filteredCentres.map((centre) => (
                        <CentreCard key={centre.id} centre={centre} />
                    ))
                ) : district && centre !== -1 ? (
                    filteredCentres.filter(c => c.id === centre).map((centre) => (
                        <CentreCard key={centre.id} centre={centre} />
                    ))
                ) : (
                    <div className="text-center w-full">
                        <p>No exam centres found for this selection.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamPaperDistributionCard;