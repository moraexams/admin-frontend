import { useState } from 'react';
import { Mark, StudentMark } from '../../types/types';
import ReactPaginate from 'react-paginate';
import { convertUTCToIST, filterIt } from '../../services/utils';
import { SnackBarConfig } from '../../types/snackbar';
import Snackbar from '../Snackbar';
import { getMarkbyIndexNo } from '../../services/markservices';
import { useNavigate } from 'react-router-dom';

const StudentMarksTable = ({ studentData, itemsPerPage, nameSearchKey,/* streamSearchKey */ }: { studentData: StudentMark[], nameSearchKey: string, /* streamSearchKey: string, */itemsPerPage: number }) => {
  const navigate = useNavigate();
  const items: StudentMark[] = Array.isArray(studentData)
    ? (nameSearchKey !== "" ? filterIt(studentData, nameSearchKey) : studentData)
    : [];

  const itemsLength = items.length;

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);

  const currentItems = Array.isArray(items) ? items.slice(itemOffset, endOffset) : [];
  const pageCount = Math.ceil(itemsLength / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % itemsLength;
    setItemOffset(newOffset);
  };

  const [viewSection, setViewSection] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackBarConfig, setSnackBarConfig] = useState<SnackBarConfig>({
    message: '',
    type: false,
    show: false
  });

  const showSnackBar = (type: boolean, message: string) => {
    setSnackBarConfig({ message: message, type: type, show: true });
    setTimeout(() => {
      setSnackBarConfig(prev => ({ ...prev, show: false }));
    }, 1000);
  };

  const [studentMark, setStudentMark] = useState<Mark | null>(null);
  const handleViewModalOpen = async (index_no: number) => {
    const student = await getMarkbyIndexNo(index_no);
    console.log(student);
    if (student) {
      setStudentMark(student);
      setModalOpen(true);
    } else {
      showSnackBar(false, 'Student Marks not entered yet');
    }
  };

  const handleEdit = async (index_no: number) => {
    navigate(`/marks/enter?index_no=${index_no}`);
  };

  return (

    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Index No
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Stream
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                S1 P1
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                S1 P2
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                S2 P1
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                S2 P2
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                S3 P1
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                S3 P2
              </th>
              <th className="py-4 px-4 font-medium text-black text-center dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <>
              {currentItems &&
                currentItems.map((student, key) => {


                  // const rowSpan = studentData ? studentData.length : 1;
                  return (
                    <tr key={key}>

                      <td rowSpan={1} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          <pre>{student.index_no}</pre>
                        </h5>
                      </td>
                      <td rowSpan={1} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.name}
                        </p>
                      </td>
                      <td rowSpan={1} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          <pre>{student.stream.substring(0, 3)}</pre>
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.s1_p1}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.s1_p2}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.s2_p1}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.s2_p2}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.s3_p1}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {student.s3_p2}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                          <button onClick={() => handleViewModalOpen(student.index_no!)} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </button>
                          <button onClick={() => handleEdit(student.index_no)} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                        </div>
                      </td>

                    </tr>
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
            pageLinkClassName={"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}
            breakLinkClassName={"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}
            activeLinkClassName={"z-10 bg-secondary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"}
            previousLinkClassName={"relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}
            nextLinkClassName={"relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-400"}
            disabledLinkClassName={"text-black-100"}
          />
        </div>
      </div>

      <div className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 overflow-y-auto ${!modalOpen && 'hidden'}`}
      >
        <div className="w-full max-w-142.5 xl:max-w-[40vw] rounded-lg bg-white px-8 py-12 dark:bg-boxdark md:px-17.5 md:py-15 max-h-screen overflow-y-auto">
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            View Student Marks
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-25 rounded bg-primary"></span>
          <div className="mb-4">
            {studentMark && (
              <>

                <div className="sm:hidden mb-5.5">
                  <select
                    className="w-full rounded-lg border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="selectStream"
                    id="selectStream"
                    value={viewSection}
                    onChange={(e) => setViewSection(Number(e.target.value))}
                  >
                    <option value="1">Maths/Bio</option>
                    <option value="2">Physics</option>
                    <option value="3">Chemistry/ICT</option>
                  </select>
                </div>
                <div className="hidden sm:flex justify-around pb-8">
                  <div className="flex items-center rounded-lg">
                    <button onClick={() => setViewSection(1)} className={`inline-flex items-center gap-2.5 rounded-l-lg border border-primary text-primary px-2 py-1 font-medium hover:border-primary hover:bg-primary hover:text-white dark:hover:border-primary sm:px-6 sm:py-3 ${viewSection == 1 && 'border-primary bg-primary text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                      Maths/Bio
                    </button>
                    <button onClick={() => setViewSection(2)} className={`inline-flex items-center gap-2.5 border border-primary px-2 py-1 font-medium text-primary hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-3 ${viewSection == 2 && 'border-primary bg-primary text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                      Physics
                    </button>
                    <button onClick={() => setViewSection(3)} className={`inline-flex items-center gap-2.5 rounded-r-lg border border-primary px-2 py-1 font-medium text-primary hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-3 ${viewSection == 3 && 'border-primary bg-primary text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                      Chem/ICT
                    </button>
                  </div>
                </div>

                <div>
                  {{
                    1: (
                      <table className="table-auto">
                        <tbody>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s1_p1}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1 Entered By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s1_p1_ent_at && studentMark.s1_p1_ent_by?.username + " at " + convertUTCToIST(studentMark.s1_p1_ent_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1 Verified By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s1_p1_vfd_at && studentMark.s1_p1_vfd_by?.username + " at " + convertUTCToIST(studentMark.s1_p1_vfd_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s1_p2}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2 Entered By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s1_p2_ent_at && studentMark.s1_p2_ent_by?.username + " at " + convertUTCToIST(studentMark.s1_p2_ent_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2 Verified By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s1_p2_vfd_at && studentMark.s1_p2_vfd_by?.username + " at " + convertUTCToIST(studentMark.s1_p2_vfd_at)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    ),
                    2: (
                      <table className="table-auto">
                        <tbody>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s2_p1}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1 Entered By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s2_p1_ent_at && studentMark.s2_p1_ent_by?.username + " at " + convertUTCToIST(studentMark.s2_p1_ent_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1 Verified By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s2_p1_vfd_at && studentMark.s2_p1_vfd_by?.username + " at " + convertUTCToIST(studentMark.s2_p1_vfd_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s2_p2}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2 Entered By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s2_p2_ent_at && studentMark.s2_p2_ent_by?.username + " at " + convertUTCToIST(studentMark.s2_p2_ent_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2 Verified By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s2_p2_vfd_at && studentMark.s2_p2_vfd_by?.username + " at " + convertUTCToIST(studentMark.s2_p2_vfd_at)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    ),
                    3: (
                      <table className="table-auto">
                        <tbody>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s3_p1}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1 Entered By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s3_p1_ent_at && studentMark.s3_p1_ent_by?.username + " at " + convertUTCToIST(studentMark.s3_p1_ent_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 1 Verified By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s3_p1_vfd_at && studentMark.s3_p1_vfd_by?.username + " at " + convertUTCToIST(studentMark.s3_p1_vfd_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s3_p2}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2 Entered By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s3_p2_ent_at && studentMark.s3_p2_ent_by?.username + " at " + convertUTCToIST(studentMark.s3_p2_ent_at)}</strong></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-medium text-black dark:text-white">Part 2 Verified By</td>
                            <td className="py-2 px-4 text-black dark:text-white">:</td>
                            <td className="py-2 px-4 text-black dark:text-white"><strong>{studentMark.s3_p2_vfd_at && studentMark.s3_p2_vfd_by?.username + " at " + convertUTCToIST(studentMark.s3_p2_vfd_at)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    ),
                  }[viewSection]}

                </div>
              </>
            )}
          </div>
          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="w-full px-3 2xsm:w-1/2">
              <button onClick={() => setModalOpen(false)} className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
                Close
              </button>
            </div>
            <div className="w-full px-3 2xsm:w-1/2">
              <button onClick={() => studentMark && handleEdit(studentMark?.index_no)} className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div >

      <Snackbar config={snackBarConfig} />
    </div>

  );
};

export default StudentMarksTable;