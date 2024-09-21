import { Coordinator, District, ExamCentre } from '../../types/types';

const CoordinatorCard = ({ coordinator }: { coordinator: Coordinator }) => {
    return (
        <div className="rounded-sm border border-stroke bg-white dark:bg-boxdark p-4 shadow-default transition duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-black dark:text-white">{coordinator.name}</h3>
            <p className="text-gray-700 dark:text-white">
                <strong>Telephone No:</strong> {coordinator.telephone_no}
            </p>
        </div>
    );
};

const CentreCard = ({ centre }: { centre: ExamCentre }) => {
    return (
        <div className="border rounded-lg shadow-md p-4 m-2 bg-white dark:bg-slate-800 dark:text-white">
            <h3 className="text-lg font-semibold">{centre.name}</h3>
            <p><strong>Bus Route:</strong> {centre.bus_route}</p>
            <div className="mt-4 ">
                <h4 className="font-semibold">Paper Counts:</h4>
                {centre.paper_counts && centre.paper_counts.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 mt-2 dark:bg-slate-800">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Subject</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Medium</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Count</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {centre.paper_counts.map((paper) => (
                                <tr key={paper.id} className='dark:bg-slate-700'>
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
                <div className="w-full mt-6">
                    <h2 className="text-xl font-semibold text-center">Coordinators</h2>
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
                <h2 className="text-xl font-semibold text-center mt-6">Exam Centres</h2>
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