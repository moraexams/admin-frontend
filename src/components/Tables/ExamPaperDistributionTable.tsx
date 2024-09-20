import { useState } from 'react';
import { District } from '../../types/types';
import ReactPaginate from 'react-paginate';
import { addPaperCount, updatePaperCount, deletePaperCount } from '../../services/examPaperDistributionService';
import { filterIt } from '../../services/filter';
import React from 'react';
// import { testdistricts } from './../../../test';

const ExamPaperDistributionTable = ({ districtData, searchKey, itemsPerPage }: { districtData: District[], searchKey: string, itemsPerPage: number }) => {

  // const
  let items: District[] = searchKey != "" ? filterIt(districtData, searchKey) : districtData;
  // items = testdistricts;
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

  const [modalOpen, setModalOpen] = useState(false);

  const [districtID, setDistrictID] = useState<number>(1);
  const [centreID, setCentreID] = useState<number>(1);
  const [centreName, setCentreName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [part, setPart] = useState<number>(1);
  const [medium, setMedium] = useState<string>('E');
  const [count, setCount] = useState<number>(1);

  const [action, setAction] = useState<string>('Add');


  const handleModalSubmit = () => {
    switch (action) {
      case 'Add':
        alert("pause add")
        // handleAddCount();
        break;
      case 'Update':
        alert("pause update")
        // handleUpdateCount();
        break;
      case 'Delete':
        alert("pause delete")
        // handleDeleteCount();
        break;
      default:
        break;
    }
  }
  const handleAddCount = () => {
    if (subject !== '' && medium !== '' && part && count && districtID && centreID) {
      addPaperCount(subject, part, medium, count, centreID, districtID)
        .then(() => {
          window.location.reload();
        }).catch((error) => {
          alert(error);
        })
    } else {
      alert("fill all fields");
    };
  }

  const handleUpdateCount = () => {
    if (subject !== '' && medium !== '' && part && count && districtID && centreID) {
      updatePaperCount(subject, part, medium, count, centreID, districtID)
        .then(() => {
          window.location.reload();
        }).catch((error) => {
          alert(error);
        })
    } else {
      alert("fill all fields");
    };
  }

  const handleDeleteCount = () => {
    if (centreID) {
      deletePaperCount(centreID)
        .then(() => {
          window.location.reload();
        }).catch((error) => {
          alert(error);
        })
    } else {
      alert("No centre selected");
    };
  }

  const handleAddModalOpen = (id: number | undefined, centreID: number | undefined) => {
    setAction('Add');
    setDistrictID(id || 1);
    // setCentreName('');
    setCentreID(centreID || 1);
    setSubject('');
    setPart(1);
    setMedium('');
    setCount(0);
    setModalOpen(true);
  };

  const handleEditModalOpen = (district_id: number | undefined, centre_id: number | undefined, paper_count_id: number | undefined) => {
    setAction('Update')
    setDistrictID(district_id || 1);
    const examCentres = districtData.find(x => x.id === district_id)?.exam_centres; // change it testdistricts to districtData
    if (examCentres) {
      const centre = examCentres.find(x => x.id === centre_id)
      if (centre && centre.id) {
        const paperCount = centre.paper_counts.find(x => x.id === paper_count_id);
        if(paperCount && paperCount.id) {
          setSubject(paperCount?.subject);
          setPart(paperCount?.part as number);
          setMedium(paperCount?.medium as string);
          setCount(paperCount?.count as number);
          setModalOpen(true);
        }
        else {
          alert("Subject count not found");
        }
      } else {
        alert("Centre not found");
      }
    } else {
      alert("District not found");
    }
  };

  const handleDeleteModalOpen = (id: number | undefined, name: string) => {
    if (id) {
      setAction('Delete');
      setCentreID(id);
      setCentreName(name)
      setModalOpen(true);
    } else {
      alert("No centre selected")
    }
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
                Part
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Medium
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Student Count
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                District Actions
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Bus Route
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Coordinator Name <br />(Tel. Number)
              </th>
              {/* <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Telephone Number
              </th> */}
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
                              {paper_counts.map((paper_count, pkey) => {
                                const { id: p_id, subject, part, medium, count } = paper_count;
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
                                          {part}
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
                                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center justify-center space-x-3.5">
                                          <button onClick={() => handleEditModalOpen(d_id, exam_centre.id, paper_count.id)} className="hover:text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                          </button>
                                          <button onClick={() => handleDeleteModalOpen(exam_centre.id, exam_centre.name)} className="hover:text-primary">
                                            <svg
                                              className="fill-current"
                                              width="18"
                                              height="18"
                                              viewBox="0 0 18 18"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                fill=""
                                              />
                                              <path
                                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                fill=""
                                              />
                                              <path
                                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                fill=""
                                              />
                                              <path
                                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                fill=""
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </td>
                                      {pkey === 0 && (<td rowSpan={centrerowSpan} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center justify-center space-x-3.5">

                                          <button onClick={() => handleAddModalOpen(d_id, c_id)} className="hover:text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                          </button>
                                        </div>
                                      </td>)}
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
                              })}

                            </>)
                        })
                      ) :
                        (
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

      <div className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${!modalOpen && 'hidden'}`}>
        <div className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 dark:bg-boxdark md:px-17.5 md:py-15">
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            {{
              'Add': `Add Paper Count to ${districtData.find(x => x.id === districtID)?.exam_centres?.find(x => x.id === centreID)?.name} in ${districtData.find(x => x.id === districtID)?.name}`,
              'Update': `Update Paper Count`,
              'Delete': 'Delete Paper Count'
            }[action]}
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-25 rounded bg-primary"></span>

          {action == "Delete" ? <div className="mb-4.5">Confirm to delete Subject Count: {centreName} with id: {centreID}</div> :
            <>
              {/* <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Subject <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  placeholder="Enter Subject Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div> */}

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Subject
                  {/* <span className="text-meta-1">*</span> */}
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    value={subject}
                    onChange={(e) =>
                      setSubject(e.target.value)
                    }
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"             >
                    <option value="Maths" className="text-body dark:text-bodydark">
                      Maths
                    </option>
                    <option value="Bio" className="text-body dark:text-bodydark">
                      Bio
                    </option>
                    <option value="Physics" className="text-body dark:text-bodydark">
                      Physics
                    </option>
                    <option value="Chemistry" className="text-body dark:text-bodydark">
                      Chemistry
                    </option>
                    <option value="ICT" className="text-body dark:text-bodydark">
                      ICT
                    </option>
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Part
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    value={part}
                    onChange={(e) =>
                      setPart(Number(e.target.value))
                    }
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"             >
                    <option value="1" className="text-body dark:text-bodydark">
                      1
                    </option>
                    <option value="2" className="text-body dark:text-bodydark">
                      2
                    </option>
                    {/* <option value="Mixed" className="text-body dark:text-bodydark">
                    Mixed
                  </option> */}
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Medium
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    value={medium}
                    onChange={(e) =>
                      setMedium(e.target.value)
                    }
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"             >
                    <option value="T" className="text-body dark:text-bodydark">
                      Tamil
                    </option>
                    <option value="E" className="text-body dark:text-bodydark">
                      English
                    </option>
                    {/* <option value="Mixed" className="text-body dark:text-bodydark">
                    Mixed
                  </option> */}
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Paper Count <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={count}
                  onChange={(e) =>
                    setCount(Number(e.target.value))
                  }
                  placeholder="Enter Centre Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </>}

          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="w-full px-3 2xsm:w-1/2">
              <button onClick={() => setModalOpen(false)} className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
                Cancel
              </button>
            </div>
            <div className="w-full px-3 2xsm:w-1/2">
              <button onClick={handleModalSubmit} className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                {action} Paper Count
              </button>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};




export default ExamPaperDistributionTable;