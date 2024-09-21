import { useState } from 'react';
import { District } from '../../types/types';
import ReactPaginate from 'react-paginate';
import { addPaperCount, updatePaperCount, deletePaperCount } from '../../services/examPaperDistributionService';
import { filterIt } from '../../services/filter';
import React from 'react';

const ExamPaperDistributionTable = ({ districtData, searchKey, itemsPerPage }: { districtData: District[], searchKey: string, itemsPerPage: number }) => {
  let items: District[] = searchKey != "" ? filterIt(districtData, searchKey) : districtData;
  // console.log(filterIt(districtData, searchKey));
  // const items = districtData;
  const itemsLength = items.length
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(itemsLength / itemsPerPage);

  // Invoke when district click to request another page.
  const handlePageClick = (event: { selected: number; }) => {
    const newOffset = (event.selected * itemsPerPage) % itemsLength;
    setItemOffset(newOffset);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                District ID
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                District Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Centre Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Subject
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Medium
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Student Count
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Bus Route
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Coordinator Name <br />(Tel. Number)
              </th>
            </tr>
          </thead>
          <tbody>
            <>
              {currentItems &&
                currentItems.map((district, key) => {
                  const { id: d_id, name, exam_centres, coordinators } = district;
                  const districtrowSpan = exam_centres ? exam_centres.length : 1;
                  return (
                    <>
                      {exam_centres && exam_centres.length > 0 ? (
                        exam_centres.map((exam_centre, ckey) => {
                          const { id: c_id, name: centrename, paper_counts, bus_route } = exam_centre;
                          const centrerowSpan = paper_counts ? paper_counts.length : 1;
                          return (
                            <>
                              {paper_counts && paper_counts.length > 0 ? (
                                paper_counts.map((paper_count, pkey) => {
                                  const { id: p_id, subject, medium, count } = paper_count;
                                  return (
                                    <tr key={pkey}>
                                      {pkey === 0 && ckey === 0 && (
                                        <>
                                          <td rowSpan={districtrowSpan * centrerowSpan} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                              {d_id}
                                            </h5>
                                          </td>
                                          <td rowSpan={districtrowSpan * centrerowSpan} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                              {name}
                                            </p>
                                          </td>
                                        </>
                                      )}

                                      {pkey === 0 && (
                                        <>
                                          <td rowSpan={centrerowSpan} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                              {centrename}
                                            </p>
                                          </td>
                                        </>
                                      )}

                                      <React.Fragment key={paper_count.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                          <p className="text-black dark:text-white">
                                            {subject}
                                          </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                          <p className="text-black dark:text-white">
                                            {medium}
                                          </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                          <p className="text-black dark:text-white">
                                            {count}
                                          </p>
                                        </td>
                                      </React.Fragment>
                                      {pkey === 0 && (
                                        <>
                                          <td rowSpan={centrerowSpan} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                              {bus_route}
                                            </p>
                                          </td>
                                        </>
                                      )}
                                      {ckey === 0 && pkey === 0 && (<td rowSpan={districtrowSpan * centrerowSpan} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11" style={{ minWidth: '200px' }}>
                                        {ckey === 0 && pkey === 0 && coordinators?.map((coordinator) => (
                                          <h5 className="font-medium text-black dark:text-white">
                                            <div className='m-1'>
                                              {coordinator.name}
                                            </div>
                                            <div>
                                              ({coordinator.telephone_no})
                                            </div>
                                          </h5>
                                        ))}
                                      </td>)}
                                    </tr>
                                  )
                                })) : (
                                <tr key={key}>
                                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <h5 className="font-medium text-black dark:text-white">
                                      {d_id}
                                    </h5>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                      {name}
                                    </p>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                      -
                                    </p>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                      -
                                    </p>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                      -
                                    </p>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center justify-center space-x-3.5">
                                      -
                                    </div>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center justify-center space-x-3.5">
                                      -
                                    </div>
                                  </td>
                                  <td rowSpan={districtrowSpan * centrerowSpan} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11" style={{ minWidth: '200px' }}>
                                    {coordinators && coordinators?.length > 0 ? (
                                      coordinators?.map((coordinator) => (
                                        <h5 className="font-medium text-black dark:text-white">
                                          <div className='m-1'>
                                            {coordinator.name}
                                          </div>
                                          <div>
                                            ({coordinator.telephone_no})
                                          </div>
                                        </h5>
                                      ))) : (
                                      <> - </>
                                    )
                                    }
                                  </td>
                                </tr>
                              )
                              }
                            </>
                          )
                        })
                      ) : (
                        <tr key={key}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {d_id}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {name}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              -
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              -
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              -
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center justify-center space-x-3.5">
                              -
                            </div>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center justify-center space-x-3.5">
                              -
                            </div>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center justify-center space-x-3.5">
                              -
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
            </>
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap justify-between my-2">
        <div className="flex items-center my-2">
          Showing {itemOffset + 1} to {endOffset < itemsLength ? endOffset : itemsLength} out of {itemsLength}
        </div>
        <div className="overflow-x-auto my-2">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName={"isolate inline-flex -space-x-px rounded-md shadow-sm"}
            pageLinkClassName={"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white focus:z-20 focus:outline-offset-0"}
            breakLinkClassName={"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white focus:z-20 focus:outline-offset-0"}
            activeLinkClassName={"z-10 bg-secondary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600"}
            previousLinkClassName={"relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white focus:z-20 focus:outline-offset-0"}
            nextLinkClassName={"relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white"}
            disabledLinkClassName={"text-black-100"}
          />
        </div>
      </div>
    </div >
  );
};




export default ExamPaperDistributionTable;