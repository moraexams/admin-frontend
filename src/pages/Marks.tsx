import { useState, useEffect } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { getMarkbyIndexNo, addMarkS1P1, addMarkS1P2,addMarkS2P1,addMarkS2P2,addMarkS3P1,addMarkS3P2, verifyMark } from "../services/markservices";
import { Mark,Student,Stream } from "../types/types";
import { getStudentbyIndex } from "../services/studentService";
import { getStreams } from "../services/streamServices";




const Marks = () => {
  
  const [streams, setStreams] = useState<Stream[]>([]);
  const [subject, setSubject] = useState(1);
  const [part, setPart] = useState(1); 
  const [mark, setMark] = useState(0);
  const [indexNo, setIndexNo] = useState(0);
  const [name, setName] = useState("");
  const [modalOpen ,setModalOpen] = useState(false);
  const [action, setAction] = useState("add");
  const [markObj, setMarkObj] = useState<Mark>();
  const [student,setStudent] = useState<Student>();

  useEffect(() => {
    const fetchData = async () => {
        try {
          const streams = await getStreams();
          setStreams(streams);
        } catch (error) {
          console.log('Failed to fetch streams', error);
        }
      };
      fetchData();
  },[])


  useEffect(() => {
    const fetchData = async () => {
        try {
            const student: Student = await getStudentbyIndex(indexNo);
            const currMark: Mark = await getMarkbyIndexNo(indexNo);
            setMarkObj(currMark);
            setStudent(student);
            setName(student.name);
        } catch (error) {
            console.log('Failed to fetch data', error);
        }
    };

    fetchData();
  }, [indexNo])

  useEffect(()=>{
    handleSetMark();
  },[markObj])

  const handleSetMark = () => {
    console.log(subject, part);
    
    if (subject==1&&part==1) {
        setMark(markObj?.s1_p1 || 0);
    }
    else if (subject==1&&part==2) {
        setMark(markObj?.s1_p2 || 0);
    }
    else if (subject==2&&part==1) {
        setMark(markObj?.s2_p1 || 0);
    }
    else if (subject==2&&part==2) {
        setMark(markObj?.s2_p2 || 0);
    }
    else if (subject==3&&part==1) {
        setMark(markObj?.s3_p1 || 0);
    }
    else if (subject==3&&part==2) {
        setMark(markObj?.s3_p2 || 0);
    }
    console.log(mark);
  }
  const handleAddMark = () => {
    console.log("Index No:", indexNo, "S.P",subject,part)
    if (subject==1&&part==1) {
        addMarkS1P1(indexNo,mark).then(() => {
            window.location.reload();
          }).catch((error) => {
            alert(error);
          });
    }
    else if (subject==1&&part==2) {
        addMarkS1P2(indexNo,mark).then(() => {
            window.location.reload();
          }).catch((error) => {
            alert(error);
          });
    }
    else if (subject==2&&part==1) {
        addMarkS2P1(indexNo,mark).then(() => {
            window.location.reload();
          }).catch((error) => {
            alert(error);
          });
    }
    else if (subject==2&&part==2) {
        addMarkS2P2(indexNo,mark).then(() => {
            window.location.reload();
          }).catch((error) => {
            alert(error);
          });
    }
    else if (subject==3&&part==1) {
        addMarkS3P1(indexNo,mark).then(() => {
            window.location.reload();
          }).catch((error) => {
            alert(error);
          });
    }
    else if (subject==3&&part==2) {
        addMarkS3P2(indexNo,mark).then(() => {
            window.location.reload();
          }).catch((error) => {
            alert(error);
          });
    }
   
  }
  const handleAddModalOpen = () => {
    setAction("add");
    setIndexNo(0);
    setName("");
    setMark(0);
    setModalOpen(true);
  }

  const handleEditModalOpen = () => {
    setAction("edit");
    setIndexNo(0);
    setName("");
    setMark(0);
    setModalOpen(true);
  }

  const handleViewtoEdit = () => {
    setAction('edit');
    setModalOpen(true);
  }

  const handleViewModalOpen = () => {
    setAction("view");
    setIndexNo(0);
    setName("");
    setMark(0);
    setModalOpen(true);
  }

  const handleVerifyMark = () => {
    verifyMark(indexNo).then(() => {
        window.location.reload();
      }).catch((error: any) => {
        alert(error);
      });
  }
  

  return (
    <DefaultLayout>
        <Breadcrumb pageName="Marks" />
        <table className="w-full table-auto">
            <thead>
                <tr className="bg-gray-2 dark:bg-meta-4">
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black text-left dark:text-white">Subject</th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black text-center dark:text-white">Part 1</th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black text-center dark:text-white">Part 2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 text-left" >1. Bio/Maths</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                        <button onClick={()=> {
                            setSubject(1);
                            setPart(1);
                            handleAddModalOpen();
                        }} className="hover:text-primary"> 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                        <button onClick={() => {
                            setSubject(1);
                            setPart(1);
                            handleEditModalOpen(); 
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button> 
                        <button className="hover:text-primary" onClick={() => {
                            setSubject(1);
                            setPart(1);
                            handleViewModalOpen();
                        }}> 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                            <button onClick={()=> {
                                setSubject(1);
                                setPart(2);
                                handleAddModalOpen();
                            }} className="hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                            <button onClick={() => {
                                setSubject(1);
                                setPart(2);
                                handleEditModalOpen(); 
                            }} className="hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button> 
                            <button className="hover:text-primary" onClick={() => {
                                setSubject(1);
                                setPart(2);
                                handleViewModalOpen();
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>
                        </div>
                    </td>
                    
                </tr>
                <tr>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 text-left">2. Physics</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                        <button onClick={()=> {
                            setSubject(2);
                            setPart(1);
                            handleAddModalOpen();
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                        <button onClick={() => {
                            setSubject(2);
                            setPart(1);
                            handleEditModalOpen(); 
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button> 
                        <button className="hover:text-primary" onClick={() => {
                            setSubject(2);
                            setPart(1);
                            handleViewModalOpen();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                        <button onClick={()=> {
                            setSubject(2);
                            setPart(2);
                            handleAddModalOpen();
                        }} className="hover:text-primary">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                        <button onClick={() => {
                            setSubject(2);
                            setPart(2);
                            handleEditModalOpen(); 
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button> 
                        <button className="hover:text-primary" onClick={() => {
                            setSubject(2);
                            setPart(2);
                            handleViewModalOpen();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                    </td>
                </tr>
                <tr>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 text-left">3. Chemistry/ICT</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                        <button onClick={()=> {
                            setSubject(3);
                            setPart(1);
                            handleAddModalOpen();
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                        <button onClick={() => {
                            setSubject(3);
                            setPart(1);
                            handleEditModalOpen(); 
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button> 
                        <button className="hover:text-primary" onClick={() => {
                            setSubject(3);
                            setPart(1);
                            handleViewModalOpen();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                    <button onClick={()=> {
                            setSubject(3);
                            setPart(2);
                            handleAddModalOpen();
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                        <button onClick={() => {
                            setSubject(3);
                            setPart(2);
                            handleEditModalOpen(); 
                        }} className="hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button> 
                        <button className="hover:text-primary" onClick={()=>{
                            setSubject(3);
                            setPart(2);
                            handleViewModalOpen();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 overflow-y-auto ${!modalOpen && 'hidden'}`}>
            <div className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 dark:bg-boxdark md:px-17.5 md:py-15 max-h-screen overflow-y-auto">
                {action === "add" && (
                <>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Index No <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={indexNo}
                        onChange={(e) => setIndexNo(Number(e.target.value))}
                        placeholder="Enter Index No"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    </div>
                    <div className="flex items-center">
                    <span className="text-lg font-medium">Name: {name}</span>
                    </div>
                    <div className="flex items-center">
                        Stream : {streams.find(stream => stream.id === student?.stream_id)?.name || ""}
                    </div>
                    <div className="mb-4.5 col-span-2">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Marks for {`Subject ${subject} - Part ${part}`} <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="number"
                        value={mark}
                        onChange={(e) => setMark(Number(e.target.value))}
                        placeholder="Enter marks"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    </div>
                </div>
                <div className="flex justify-center  mt-6">
                    <button onClick={() => handleAddMark()} className="w-full md:w-auto px-6 py-3 rounded border border-stroke bg-gray text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
                        Submit
                    </button>
                </div>
                </>
                )}

                {action === "edit" && (
                <>  
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Index No <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={indexNo}
                        onChange={(e) => setIndexNo(Number(e.target.value))}
                        placeholder="Enter Index No"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    </div>
                    <div className="flex items-center">
                    <span className="text-lg font-medium">Name: {name}</span>
                    </div>
                    <div className="flex items-center">
                        Stream : {streams.find(stream => stream.id === student?.stream_id)?.name || ""}
                    </div>
                    <div className="mb-4.5 col-span-2">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Marks for {`Subject ${subject} - Part ${part}`} <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={mark}
                        onChange={(e) => setMark(Number(e.target.value))}
                        placeholder="Enter marks"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    </div>
                </div>
                <div className="flex justify-center  mt-6">
                    <button onClick={() => handleAddMark()} className="w-full md:w-auto px-6 py-3 rounded border border-stroke bg-gray text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
                        Submit
                    </button>
                </div>
                </>
                )}

                {action === "view" && (
                    <>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Index No <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                value={indexNo}
                                onChange={(e) => setIndexNo(Number(e.target.value))}
                                placeholder="Enter Index No"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            </div>
                            <div className="flex items-center">
                            <span className="text-lg font-medium">Name: {name}</span>
                            </div>
                                <div className="flex items-center">
                                    Stream : {streams.find(stream => stream.id === student?.stream_id)?.name || ""}
                                </div>
                            <div className="mb-4.5 col-span-2">
                                Marks for {`Subject ${subject} - Part ${part}`} : {mark}
                            </div>
                        </div> 
                        <div className="flex justify-center mt-6 gap-4">
                            <button onClick={() => {
                                setIndexNo(student?.index_no || 0);
                                handleVerifyMark()}} className="w-full md:w-auto px-6 py-3 rounded border border-stroke bg-gray text-center font-medium text-black transition hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-primary dark:hover:bg-primary">
                                Edit
                            </button> 
                            <button onClick={() => {
                                setIndexNo(student?.index_no || 0);
                                handleViewtoEdit()}} className="w-full md:w-auto px-6 py-3 rounded border border-stroke bg-gray text-center font-medium text-black transition hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-primary dark:hover:bg-primary">
                                Verify
                            </button> 
                        </div>
                                                                                    
                    </>
                )}
                <div className="flex justify-center mt-6">
                <button onClick={() => setModalOpen(false)} className="w-full md:w-auto px-6 py-3 rounded border border-stroke bg-gray text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
                    Cancel
                </button>
                </div>
            </div>
        </div>

        
    </DefaultLayout>
  )
}

export default Marks
